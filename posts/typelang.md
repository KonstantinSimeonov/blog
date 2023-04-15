---
title: A programming language hidden in plain sight
date: 2023-04-13
---

Typescript is a pretty popular language (and for good reasons), but it has its fair share of non-obvious and hidden things. In this post, we'll explore what is possible with typescript without writing any runtime code (outside of educational purposes). If you're recursively challenged, chances are you might not enjoy this post.

*Note (although you probably already know this): if you want to inspect the examples or tinker with them, you can hover the type names in your editor to see the types.*

## Types/Variables

Typescript can often be a seriously awesome language and part of this comes from the ways it lets programmers define types:

```ts
type Point2d = [number, number];
type Point3d = [...Point2d, number]; // equals [number, number, number]

type DistFunc = (point: Point2d | Point3d) => number;
```

The careful observer might notice that defining types via the `type` keyword looks a lot like defining `const` variables. We usually don't think of typescript types as variables, because we cannot reassign them:

```ts
type RequestState = `error` | `success`;

// error
RequestState = RequestState | `pending`;
```

Let's say for now that in `type X = ...`, `X` is an immutable type variable and see where this gets us.

## Generic Types/Functions

[Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html) are pretty rad. Let's see how we use them with types:

```ts
type Pair<A, B> = [A, B];
type A = Pair<3, 4>; // [3, 4]
type B = Pair<5, 8>; // [5, 8]

type Concat<XS extends any[], YS extends any[]> = [...XS, ...YS];
type Nums = Concat<[1, 2, 3], [4]>; // [1, 2, 3, 4]
type MoreNums = Concat<A, B>; // [3, 4, 5, 8]
```

`Pair` takes two type arguments and returns an fixed-length array type (tuple... sorta) containing the first and the second argument. `Concat` takes two type arguments (constrained to be arrays so that the spread will work) and returns a concatenated array type. Let's look at some JavaScript code next:

```js
const pair = (a, b) => [a, b];
const a = pair(3, 4);
const b = pair(5, 8);

const concat = (xs, ys) => [...xs, ...ys];
const nums = concat([1, 2, 3], [4]); // [1, 2, 3, 4]
const more_nums = concat(a, b); // [3, 4, 5, 8]
```

The two snippets look kind of similar, right? If we squint a bit, we can see the similarity between the `Pair` type and `pair` function - both accept arguments and evaluate to a value - in the case of `Pair` the value is a type, in the case of `pair` a runtime array. `Concat` and `concat` are likewise similar. Generics are pretty similar to functions, let's leave it at that for now.

## Conditionals

One pretty interesting typescript feature is [conditional types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html):

```ts
type A = `x` | `y`;
type IsAString = A extends string ? true : false; // true

type B = `x` | `y` | 3;
type IsBString = B extends string ? true : false; // false because of 3, which is a number
```

For anyone feeling too lazy to read through the typescript docs, here's a brief explanation of conditional types:

```ts
A extends B ? X : Y
```

If `A` is assignable to `B` (i.e. `A` is a subtype of `B`) then evaluate to `X`, otherwise evaluate to `Y`. Some examples:

|        A         |          B           | A extends B |
| :--------------: | :------------------: | :---------: |
|     `string`     |       `string`       |     yes     |
|   `"a" \| "b"`   |       `string`       |     yes     |
|      `3`         |       `number`       |     yes     |
|     `number`     |         `3`          |     no      |
| `number \| null` |       `number`       |     no      |
|    `number[]`    |       `any[]`        |     yes     |
|    `number[]`    | `(number \| null)[]` |     yes     |

A cute trick to understand `A extends B` is to think about it like that:

```ts
let a: A = ...
let b: B = ...

// if this is not a type error, then A extends B
b = a
```

By itself, conditional typing doesn't look that big of a deal, but when we combine it with generic types, it becomes pretty powerful:

```ts
type First<T> = T extends Array<any> ? T[0] : never

type x = First<[1, 2, 3]> // x is 1
type y = First<[]> // y is undefined
```

If you're bamboozled by the use of the [`never`](https://www.typescriptlang.org/docs/handbook/basic-types.html#never) type, you can think of it in two ways:
- `never` is to types what `null` is to values (not correct in general, but helps develop an intuition for its utility)
- `never` is the empty type, meaning there exist no values which are of type `never`

Equivalent JavaScript code:

```js
const first = xs => Array.isArray(xs) ? xs[0] : null
const x = first([1, 2, 3]) // x is 1
const y = first([]) // y is undefined
```

Conditional types are very similar to the JavaScript ternary operator - if the `extends` condition holds, the conditional evaluates to the first value, otherwise it evaluates to the second. This provides programmers with a way to do branching logic and flow control when defining types. Conditional types allow generics to branch out based on their input parameters.

## Infer/Pattern Matching

[`infer`](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types), while looking somewhat scary at first, is actually pretty useful and not that complicated. It's a lot like JavaScript destructuring (or pattern matching, if you lean that way).

```ts
type Point = { x: 3; y: 4 }
type X = Point extends { x: infer X } ? X : never // X is 3
```

Equivalent JavaScript code (not exactly, but easier to understand):

```js
const point = { x: 3, y: 4 }
const { x } = point
```

In reality, we also perform an `extends` check, so the equivalent JavaScript code would look more like:

```js
let x
if (point?.hasOwnProperty(`x`))
  x = point.x
else
  x = null
```

`infer` can only be used in an `extends` clause, meaning it's meant to augment the conditional checks with destructuring. It provides a way to extract parts of the type we asserted with `extends`. To the functionally inclined, this should look a lot like pattern matching. Haskell example:

```hs
data Point = Point Int Int

getX (Point x _) = x -- pattern matching

let point = Point 3 4
let x = getX point -- x is 3
```

We went a bit overboard with the Haskell example - we used pattern matching in a function. Let's see if we can do the same with a typescript type - a generic type (might as well call it a type function at this point) that extracts the `x` property of an object type:

```ts
type GetX<T> = T extends { x: infer X } ? X : never
// another fun bit: the X type variable
// is only available in the "true" branch of the conditional

type x = GetX<{ x: 3; y: 4 }> // x is 3
type x2 = GetX<{ y: 4 }> // x2 is never
```

We can build some sweet stuff with generic types (functions) and conditional types (if/else + destructuring). An example would be getting the first value in an array type:

```ts
type First<T> = T extends [infer X, ...any[]] ? X : never
type x = First<[1, 2, 3]> // x is 1
type y = First<[]> // never
```

Extracting the type of a value wrapped in `Promise`:

```ts
type Awaited<T> = T extends Promise<infer V> ? V : never

const pr = Promise.resolve({ x: 42 })
type ResolvedValue = Awaited<typeof pr> // { x: number }
```

Or getting the return type of a function:

```ts
type ResultType<F> = F extends (...args: any[]) => infer R ? R : never

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0)

type SumReturnType = ResultType<typeof sum> // number
```

We can see that generics (functions) + conditional types (if/else + destructuring) can make some wild stuff happen. In the next section we'll ramp that up.

## Recursive Types/Recursion

Let's pick up a couple recursive data structures, for example binary trees and json values. Let's look at one possible representation of those structures in typescript types:

```ts
type BinaryTree<T> = {
  left: BinaryTree<T> | null
  right: BinaryTree<T> | null
  value: T
}

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue
  | { [key: string]: JsonValue }
```

A recursive type, much like a recursive function, is defined in terms of itself. But since we saw that we can use conditional types to evaluate differently based on type arguments, can't we use that as well together with recursion? Let's take a step back and look at a recursive JavaScript implementation of getting the last element of an array:

```js
const last = ([x, ...xs]) => xs.length === 0 ? x : last(xs)
last([1, 2]) // 2
last([1]) // 1
last([]) // undefined
```

Disregarding the obviously horrible performance, the above is a correct implementation of getting the last element. Since we're armed with recursive types, generics and conditionals, we can try something like the following:

```ts
type Last<T> =
  T extends [infer X] // if T has one element
    ? X // just return it
    : T extends [any, ...infer XS] // else if it has more than one
        ? Last<XS> // keep going on without the first element
        : never // if it's not an array at all, bail

type x = Last<[1, 2, 3]> // 3
type y = Last<[1]> // 1
type z = Last<[]> // never
```

Let's reiterate what we've seen so far:
- immutable values (the types themselves)
- immutable variables (`type X = ...`, allows us to store values)
- pattern matching or conditional expressions + destructuring if you will (`a extends infer b ? b : ...`, allows us to do conditional computing and access to properties of values)
- functions (generics)
- recursion (allows us to repeat some calculation, much like loops do)

**That's essentially a small programming language on its own!**

Let's keep looking at it through those lens and implement a small program that splits a string by a separator:

```ts
// function which accepts two arguments and returns an array of strings
type Split<Str extends string, Sep extends string> =
  Str extends `${infer Chunk}${Sep}${infer Rest}`
    ? [Chunk, ...Split<Rest, Sep>]
    : [Str]

type a = Split<`1, 2, 3`, `, `> // [`1`, `2`, `3`]
type b = Split<`null pointer exception lmao`, ` `> // [`null`, `pointer`, `exception`, `lmao`]
type c = Split<`123`, ` `> // [`123`]
```

As it turns out, a lot of programs can be expressed (not necessarily conveniently) just in terms of recursion, immutable values, variables and conditionals. I've been doing some fun programs without any runtime values ([json parsing with parser combinators](https://github.com/KonstantinSimeonov/aot/blob/master/programs/json-parse.ts), calculating [Fibonacci numbers](https://github.com/KonstantinSimeonov/aot/blob/master/programs/fibonacci.ts), etc) over at [github.com/KonstantinSimeonov/aot](https://github.com/KonstantinSimeonov/aot). If you're curious, go check it out, it has a bunch more wild (or terrifying, depending on where you stand on the subject) stuff.

## More `W`s and `L`s

This language also supports/lacks a couple of additions things:
- supports higher order functions (higher kinded types) through interface augmentation (have a look at [`fp-ts`](https://gcanti.github.io/fp-ts/), they use that concept)
- supports maps on the type level through object types `{ [key in X]: Y }`
  - add values with `&`
  - remove values with [`Omit<K, V>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)
  - lookup with `infer` or `[]`
- supports sets via union types - `A | B | C`
  - add values with `|`
  - remove values with [`Exclude<U, K>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)
  - lookup with `extends`
- supports lists via tuples/arrays
- supports typing generic parameters via `extends` - `type Split<Str extends string, Sep extends string> = ...`
- doesn't support arithmetic (you can roll your own and it [sort of hurts](https://github.com/KonstantinSimeonov/aot/blob/master/data/Int.ts))
- has a recursion depth limit, meaning you can't go arbitrarily deep with recursion

## Practicality

While pretty curious, this somewhat hidden language is rarely practical to end user developers. It often finds much more use in libraries, where authors are trying to provide good DX/ensure the type safety of their libraries:
- parse a graphql string to provide typings for the query result
- provide a [deep partial type](https://github.com/colinhacks/zod/blob/502384e56fe2b1f8173735df6c3b0d41bce04edc/src/helpers/partialUtil.ts#L38) for different js types in the case of zod
- used by the typescript team to implement types like [`Awaited`](https://www.typescriptlang.org/docs/handbook/utility-types.html#awaitedtype), [`ReturnType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype) and [`Parameters`](https://www.typescriptlang.org/docs/handbook/utility-types.html#parameterstype)
- [implementing](https://github.com/gcanti/monocle-ts) a [lens](https://fluffynukeit.com/how-functional-programming-lenses-work/) library
- providing correct return types on something like a `mergeDeep` function which merges two objects
- provide correct types of url params on express request: `app.use("/users/:id", (req, res) => ...) // req.params.id will be string`

## Wanna go further?

Checkout out [type challenges](https://github.com/type-challenges/type-challenges).
