## ToC

- exceptions drawbacks
  - perf
  - unpredictable code
  - try-catch is awful
    - not an expression
    - nesting
    - no pattern matching
  - fancy footwork for goto across stack frames
  - better to handle stuff at compile time
  - gets in the way of reuse/composition
  - not as typesafe
  - language runtime complexity
  - operational errors vs bugs
  - bad for documentation

- alternatives
  - return the errors (golang, haskell, rust)
    - problems -> brevity, ease of use, complicated types
    - boons
      - type safety
      - predictability
      - documentation
      - ease of handling
      - reusability
  - return errors codes
