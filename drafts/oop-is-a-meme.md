## ToC

- oop doesn't solve the problems worth solving
  - perf
  - safety
  - understandability
  - tree-shaking
  - metaprogramming
  - security
  - memory management
  - side-effects
  - immutability
  - parallelizability

- the problems it solves can be better solved in other paradigms
  - abstraction (rust, haskell, ts examples)
  - encapsulation is a lie (access modifiers are garbage, module based is better)
  - polymorphism (rust, haskell, scala, ts examples)
  - inheritance vs traits
  - testability - can be a lot better in other paradigms (rust, haskell, ts examples)
  - reusability - traits/typeclasses vs inheritance, functions vs classes

- SOLID can be done better in other paradigms
  - data + methods conflicts with S
  - traits/typeclasses/structural typing are better for O than whatever OOP has
  - L doesn't make too much sense outside of inheritance, but thinking about properties of code can be good (property based testing)
  - I is easier with separate functions and data
  - D is just a function parameter, lol

- A lot of design patterns are bandaids
  - factories of all kinds vs curried functions
  - strategy vs just functions
  - singleton vs side-effect free
  - commands and template methods are just closures
  - visitors are just fancy footwork for iterators
  - DI doesn't require frameworks; doing it at runtime is often overkill

- Other complaints
  - classes are just syntax sugar for closures
  - ungodly level of nesting
  - too complex for no good reason
  - shifts programmers' focus to the wrong things
  - fusion of the worst aspects of declarative and imperative
  - bad at modeling real world concepts, but also bad at modeling computer stuff

- What oop does well
  - chaining calls (better autocompletion)
