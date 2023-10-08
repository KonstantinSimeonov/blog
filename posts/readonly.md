---
title: Readonly in typescript
description: In this post we'll look at a couple of ways to use readonly types in typescript to improve the stability and expressiveness in a typescript codebase.
date: 2023-10-08
---

## How does it work?
Let's get a bit technical - readonly types prevent mutations in a couple of ways:
1. For objects, `Readonly<T>` prevents assignment and deletion of properties
1. For arrays, `readonly T[]` doesn't provide methods like `splice`, `sort`, `push` and `shift` in addition to the above

```ts
type Point = { x: number; y: number }
declare const p: Readonly<Point>

// all of the below lead to type erros
delete p.x
p.y = 3
```

Additionally, for arrays, you `readonly T[]` is not a subtype of `T[]`, so the following would be a type error:

```ts
declare const xs: readonly number[]
declare function test(xs: number[]): number

// type error, test might mutate readonly type
test(xs)
```

The reverse type checks: `T[]` is a subtype of `readonly T[]`:

```ts
declare const xs: number[]
declare function test(xs: readonly number[]): number

test(xs)

// true
type A = number[] extends readonly number[] ? true : false
// false
type B = readonly number[] extends number[] ? true : false
```

Unfortunately, it's not the same for `Readonly<T>` and `T`:

```ts
type Point = { x: number; y: number }
declare function dist0(point: Point): number
declare const p: Readonly<Point>

// no type error :(
dist(p)
```

## An example

Imagine you're hunting a big in a non-trivial feature which is made up of let's say 20 functions, most of them between 20 and 50 lines. Say one of the more complicated functions has a signature like that:

```ts
function adjustLoanParties(
  parties: LoanParty[],
  contacts: Contact[],
  loan: Loan
): Loan
```

At first glance, it looks pretty straightforward - a function that needs `parties` and `contacts` to return an adjusted loan. What's not so good is that there are a number of things we have no idea about:
1. can it throw an error (is it a partially defined function)
1. does it work with empty `parties` or `contacts`
1. does it mutate its parameters in any way
1. does it return a different object reference to a loan or just modifies the passed loan and returns it for convenience

If we're hunting a bug, all of those could be relevant questions the answers to which can be helpful.

## Let's do something about it

We can't do a lot with readonly types about `1` and `2`, but we can do something about `3` and `4`. Adjusting the function signature a bit, we can end up with this:

```ts
function adjustLoanParties(
  parties: readonly LoanParty[],
  contacts: readonly Contact[],
  loan: Readonly<Loan>
): Loan
```

This tells us a couple of things at a glance:
- the `parties` and `contacts` arrays will not have elements added, removed or swapped
- the `loan` object will not have it's top-level properties changed
- since none of the parameters can be mutated, the adjusted loan has to be the result

This is enforced by the typescript type checker due to the use of `readonly T[]` and `Readonly<T>`. Let's look at what's possible and what's not with this type signature:

```ts
function adjustLoanParties(
  parties: readonly LoanParty[],
  contacts: readonly Contact[],
  loan: Readonly<Loan>
): Loan {
  // type error, mutating readonly array
  contacts.push(SYSTEM_USER_CONTACT)

  // okay, it doesn't mutate the parameter
  const partyIds = parties.map(p => p.id)

  // type error, sort mutates the parameter
  const contactEmails = contacts
    .sort(c => c.createdAt)
    .filter(c => c.email)
    .map(c => c.email)

  // type error, mutating a readonly object
  loan.partyIds = partyIds

  // okay, doesn't mutate anything
  return { ...loan, partyIds, contactEmails }
}
```

While mutating parameters isn't necessarily a bad thing, it often limits reusability and can be overlooked and lead to faulty unintended behavior. It may not look like a big deal, but let's say we have a couple more `adjust` functions and call them like that:

```ts
const withPartiesAndContacts = adjustLoanParties(parties, contacts, loan)
const withBorrowers = adjustLoanBorrower(borrowers, contacts, withPartiesAndContacts)
const withDocuments = adjustLoanDocuments(documents, borrowers, withBorrowers)
```

In the above, if all the `adjust` function signatures mark their parameters propertly as readonly, we can be certain that the intention is to calculate a new loan object on each step and the final result. Each function should get the latest adjusted loan. The `borrowers` and `contacts` arrays won't change between calling those three functions. This eliminates a host of problems we would to look at while debugging otherwise. Using readonly types communicated more clearly via function signature what might be changed by the function.

## Another way to look at it
Readonly types can be thought of as a way to express write permissions to objects. Let's look at a couple functions signatures:

```ts
// this function doesn't need a write permission on nums
function sum(nums: readonly number[]): number

// this function needs to write to nums
function remove_negative_inplace(nums: number[]): void

// this function doesn't need to be able to modify loan
function calculateMarketValue(loan: Readonly<Loan>): BigInt

// no way to know whether it mutates based on signature alone
function removeUnnecessaryProperties(loan: Loan): Loan

// this probably mutates
function removeUnnecessaryProperties(loan: Loan): void
```

## Readonly in other places
So far, we've looked at readonly types only for function parameters, but readonly can be used in other places as well:

```ts
// in the return type
function startMeasuring(intervalMs: number): readonly number[]

// in types
type Concat<Left extends readonly any[], Right extends readonly any[]> = ...
type Loan = {
  program: string
  contacts: readonly Contact[]
}

// in variable typings
const words: readonly string[] = text.split(/b/)
```

The return type is an interesting one, let's consider the function below:

```ts
function startMeasuring(intervalMs: number): readonly number[] {
  const measurements: number[] = []
  setInterval(
    () => measurements.push(measureSomething()),
    intervalMs
  )

  return measurements
}
```

This function retains write permissions to the array it returns and doesn't give write permissions to the caller. The caller can use the resulting memory to read measurements, but not modify them, since it might interfere with the internal logic of the mutations which the function does.

## In practice
I've found typing parameters as readonly to be the most useful, since it gives mutability guarantees to the caller, while usually not requiring any gymnastics. It's a bit of a different story for return types - if the function which returns a readonly value does not need to mutate it after it's execution, it's better to keep the return type as non-readonly:

```ts
function getExternalContacts(contacts: readonly Contact[]): readonly Contact[] {
  return contacts.filter(c => c.isExternal).sort(compareContacts)
}
```

The function above is done with it's memory as soon as it returns, there's no need no to yield write permission to the caller in contrast to `startMeasuring` from the example in the previous section.

### Getting out of readonly
Some tasks are more easily accomplished with mutations, so here are a couple of ways to get out of readonly:

```ts
const nums: readonly number[] = [1, 2, 3]
const point: Readonly<Point> = { x: 3, y: 4 }

const writeableNums = nums.slice() // or [...nums], or .map, .filter, etc
const writeablePoint = { ...point }
```

### Deep readonly
Consider the code below which type checks successfully:

```ts
function adjustLoan(loan: Readonly<Loan>): Loan {
  loan.parties[0].firstName = `Jebaited`
  return { ...loan, version: `V3` }
}
```

`Readonly<T>` only freezes one level of properties, so it doesn't catch the mutation above. If deep immutability is desired, there's a neat package called [type-fest](https://github.com/sindresorhus/type-fest), which provides a set of useful utility types, `ReadonlyDeep<T>` among them:

```ts
import { ReadonlyDeep } from "type-fest"

function adjustLoan(loan: ReadonlyDeep<Loan>): Loan {
  // no longer type checks
  loan.parties[0].firstName = `Jebaited`
  return { ...loan, version: `V3` }
}
```

### React

Useful for state atoms, guarantees state won't be mutated directly.

```tsx
const [borrowers, setBorrowers] = useState<readonly Borrower[]>([])
```

Useful to guarantee props immutability with `type-fest`:

```tsx
import * as React from "react"
import { ReadonlyDeep } from "type-fest"

type FC<T = {}> = React.FC<ReadonlyDeep<T>>

const BorrowerInfo: FC<{ borrower: Borrower }> = ({ borrower }) => {
  React.useEffect(() => {
    // type error
    borrower.updatedAt = new Date()
  }, [])
  // ...
}
```

### Difference from `as const`
`as const` is not applicable to a type, but rather to an expression. It narrows the types of the expression as much as possible on top of making it readonly:

```ts
// doesn't work on types
type Point = { x: number; y: number } as const

const p = { x: 3, y: 4 } as const

// { readonly x: 3, readonly y: 4 }
type P = typeof P
```

## Further reading:
- [type-fest](https://github.com/sindresorhus/type-fest) docs - includes types for readonly maps, sets and more
- [const assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions)
