---
description: 'The definition of the lexical structure of Wrought source code'
sidebar: 'sidebar'
next: '/spec/semantics/'
prev: '/spec/'
---

# Syntax

Wrought is a programming language defined as a context-free grammar over an alphabet of tokens.

## Convention

* Terminals are written in one of the following forms $\term{u32}, \term{for}, \terms{::}$
* Terminals may be defined using regular expression patterns, as in $/\verb@[0-9]a*@/$
* Non-terminals are written in the following way $\nterm{literal-num}, \nterm{expr}$
* Grammar productions are of the form $\nterm{a} \Coloneqq \; ...$, where the right-hand side is a combination of terminals and non-terminals
* Grammar productions can be combined using the or operator, as in $\nterm{a} \Coloneqq \; ... \mid ...$

## Tokens
Wrought source code is split into tokens by repeatedly consuming the longest string of characters that matches a token rule,
and tie-breaking by precedence order.
Tokens are defined in precedence order by this document.

### Comments
Wrought allows only single-line double-slash prefixed comments.
$$
/\verb@//[^\n]*@/
$$

### String Literals
Wrought provides two ways of defining strings interpretted as UTF-8 byte values :
 * Standard Strings - which match the syntax of JSON strings as defined in ECMA-404
 * Raw Strings - input that, for some $n$, begins with $\term{r}\term{\#}^n\term{"}$, ends with $\term{"}\term{\#}^n$, and does not contain the end pattern.

### Whitespace
Wrought treats sequences of contiguous whitespace characters as a whitespace token.
$$
/\verb@[ \n\t\f]+@/
$$

### Keywords / Reserved Words

| Kind          | Tokens |
| ------------- | ------ |
| item          | $\term{export}, \term{import}, \term{from}, \term{fn}, \term{table}, \term{mem}$ |
| control       | $\term{if}, \term{for}, \term{in}, \term{loop}, \term{break}, \term{continue}, \term{return}$ |
| pointer types | $ \term{Ptr}, \term{Slice}$ |
| int types     | $\term{u8}, \term{u16}, \term{u32}, \term{u64}, \term{s8}, \term{s16}, \term{s32}, \term{s64}, \term{i32}, \term{i64}$ |
| float types   | $\term{f32}, \term{f64}$ |
| misc          | $\term{as}, \term{at}, \term{let}, \term{mut}, \term{bool}, \term{true}, \term{false}$ |

### Symbols and Operators

| Kind       | Tokens |
| ---------- | ------ |
| paired     | $\terms{(}, \terms{)}, \terms{\{}, \terms{\}}, \terms{[}, \terms{]}$ |
| delimiters | $\terms{,}, \terms{.}, \terms{..}, \terms{:}, \terms{::}, \terms{;}$ |
| misc       | $\terms{=}, \terms{->}$ |
| arithmetic | $\terms{+}, \terms{-}, \terms{*}, \terms{/}, \terms{\verb@%@}$ |
| logical    | $\terms{!}, \term{or}, \term{and}$ |
| bitwise    | $``\vert", \terms{\verb@&@}, \terms{\verb@^@}, \terms{<<}, \terms{>>}, \terms{>>>}$ |
| op assign  | $``\vert\term{=}", \terms{\verb@&=@}, \terms{\verb@^=@}, \terms{+=}, \terms{-=}, \terms{*=}, \terms{/=}$ |
| comparison | $\terms{<}, \terms{<=}, \terms{>}, \terms{>=}, \terms{==}, \terms{!=}$ |

### Identifiers
$$
/\verb@[_a-zA-Z][_a-zA-Z0-9]*@/
$$

### Numeric Literals
* Decimal - $/\verb@[0-9][_0-9]*(\.[0-9][_0-9]*)?@/$
* Binary - $/\verb@0b[01][_01]*@/$
* Hexadecimal - $/\verb@0x[0-9a-fA-F][_0-9a-fA-F]*@/$


## Grammar
The grammar is written in Backus-Naur Form, with the addition of the Kleene-Star operator.
The grammar implicitly allows white-space and comment tokens to be added between the tokens of any production rule,
these are omitted from the parse tree and abstract syntax tree.

As a convenience, some sets of terminals are represented by non-terminals which are defined using a production rule to a description of the set.
The identifiers are one such example of this pattern.

$$
\begin{aligned}
    \nterm{ident} &\Coloneqq \textit{An identifier token} \\
\end{aligned}
$$

### Types

#### Result Types
Wrought expressions and functions use the same set of Result Types, which is the set of all sequences of zero or more Value Types.
A single unparenthesized type is equivalent to a parenthesized sequence one element long of that type.
The empty parenthesized list type is the unit type and is the result for expressions which have no usable value.

$$
\nterm{restype} \Coloneqq \nterm{valtype} \mid \term{(} \nterm{valtype}^\ast \term{)}
$$

#### Value Types
Wrought expression operands and variables can be any of the basic types WebAssembly operates on (e.g. i32, f64),
pointer types (represented as i32) to any Wrought Memory Types,
or the identifier of struct types.

$$
\begin{aligned}
    \nterm{valtype} &\Coloneqq \nterm{basic-val} \mid \nterm{pointer-val} \mid \nterm{ident} \\ 
    \nterm{basic-val} &\Coloneqq \term{i32} \mid \term{i64} \mid \term{u32} \mid \term{u64} \mid \term{s32} \mid \term{s64} \mid \term{f32} \mid \term{f64} \mid \term{bool} \\
    \nterm{pointer-val} &\Coloneqq \term{Ptr} \term{[} \nterm{pointable} \nterm{p-options} \term{]} \mid \term{Slice} \term{[} \nterm{pointable} \nterm{p-options} \term{]} \\
    \nterm{p-options} &\Coloneqq \lambda \mid  \term{,} \nterm{num} \mid  \term{,} \nterm{num} \term{,} \nterm{num} \mid  \term{,} \nterm{num} \term{,} \nterm{num} \term{,} \nterm{ident} \\
    \nterm{num} &\Coloneqq \nterm{literal-num} \\
\end{aligned}
$$

#### Pointable Types
The types that can be loaded from and stored to the WASM linear memory (a superset of the Value Types).
It is possible to make pointers to these types.


$$
\begin{aligned}
    \nterm{pointable} &\Coloneqq \nterm{valtype} \mid \nterm{memonly-val} \\
    \nterm{memonly-val} &\Coloneqq \term{u8} \mid \term{u16} \mid \term{s8} \mid \term{s16} \mid \term{i8} \mid \term{i16} \\
\end{aligned}
$$

#### Function Types
Wrought functions are represented as a type from zero or more value types to a Result Type.
A function with an empty result can omit the arrow clause or use the unit type.

$$
\begin{aligned}
    \nterm{fntype} &\Coloneqq \term{fn} \term{(} \nterm{valtype}^\ast \term{)} \; \term{->} \; \nterm{restype} \\
    \nterm{fntype} &\Coloneqq \term{fn} \term{(} \nterm{valtype}^\ast \term{)} \\
\end{aligned}
$$

### Module

#### Items
A module is a sequence of items, which has no restrictions about which kinds of items appear before others or regarding callees being defined before callers.
The only semantically meaningful consequence of ordering is that ordering amongst items of a common kind (e.g. functions) will be used to assign them indices in the output WASM module.
Wrought also defines custom items which do not translate to sections of a WASM module.
Currently, structs are the only example of this but they may be expanded on in the future.

$$
\begin{aligned}
    \nterm{module} &\Coloneqq \nterm{item}^\ast \\
    \nterm{item} &\Coloneqq \nterm{import} \mid \nterm{func} \mid \nterm{table} \mid \nterm{mem} \mid \nterm{global} \\
    \nterm{item} &\Coloneqq \nterm{struct} \\
\end{aligned}
$$

#### Imports and Exports
An import item specifies a module, item identifier, and import item type to bring into the current module.
Exports are not a special type of item, instead any item can be annotated with the export keyword to export it.

$$
\begin{aligned}
    \nterm{import} &\Coloneqq \term{from} \; \nterm{ident} \; \term{import} \; \nterm{ident} \term{:} \nterm{external} \term{;} \\
    \nterm{external} &\Coloneqq \nterm{fntype} \mid \nterm{memtype} \mid \term{mut} \nterm{valtype} \mid \term{const} \nterm{valtype} \\
    \nterm{memtype} &\Coloneqq \term{mem} \term{[} \nterm{memtype-bounds} \term{]} \\
    \nterm{memtype-bounds} &\Coloneqq \nterm{literal-num} \\
    \nterm{memtype-bounds} &\Coloneqq \nterm{literal-num} \term{,} \nterm{literal-num} \\
\end{aligned}
$$

#### Functions
A function is a named parameterized expression which may have side effects and behave differently based on side-causes.

$$
\begin{aligned}
    \nterm{func} &\Coloneqq \term{export}^? \; \nterm{func-sig} \; \nterm{block} \\
    \nterm{func-sig} &\Coloneqq \term{fn} \nterm{ident} \term{(} \nterm{func-args} \term{)} \term{->} \nterm{restype} \\
    \nterm{func-sig} &\Coloneqq \term{fn} \nterm{ident} \term{(} \nterm{func-args} \term{)} \\
    \nterm{func-args} &\Coloneqq \nterm{ident} \term{:} \nterm{valtype} \mid \nterm{func-args} \term{,} \nterm{ident} \term{:} \nterm{valtype} \\
\end{aligned}
$$

#### Tables and Memory

$$
\begin{aligned}
    \nterm{table} &\Coloneqq \term{table} \; \nterm{ident} \term{[} \nterm{literal-num} \term{]} \term{;} \\
    \nterm{mem} &\Coloneqq \term{let} \; \nterm{ident} \; \term{=} \; \term{mem} \term{[} \nterm{literal-num} \term{]} \term{;} \\
    \nterm{ident-array} &\Coloneqq \term{[} \nterm{idents} \term{]} \\
    \nterm{exprs} &\Coloneqq \nterm{inline-expr} \mid \nterm{nums} \term{,} \nterm{inline-expr} \\
\end{aligned}
$$

#### Globals and Statics

$$
\begin{aligned}
    \nterm{global} &\Coloneqq \term{let} \nterm{ident} \term{=} \nterm{literal-num} \term{;} \\
    \nterm{global} &\Coloneqq \term{let} \; \term{mut} \nterm{ident} \term{=} \nterm{literal-num} \term{;} \\
    \nterm{static} &\Coloneqq \term{at} \; \nterm{static-loc} \; \term{let} \;\nterm{ident} \;  \term{=} \; \nterm{static-val} \term{;} \\
    \nterm{static-loc} &\Coloneqq \nterm{ident} \term{[} \nterm{literal-num} \term{:} \nterm{literal-num} \term{]} \\
    \nterm{static-val} &\Coloneqq \term{[} \textit{comma-separated literal-nums} \term{]} \\
    \nterm{static-val} &\Coloneqq \nterm{literal-num} \mid  \nterm{literal-str} \\
\end{aligned}
$$

#### Struct

$$
\begin{aligned}
    \nterm{struct} &\Coloneqq \term{struct} \; \nterm{ident} \; \term{\{} \nterm{struct-body} \term{\}} \\
    \nterm{struct-body} &\Coloneqq \nterm{ident} \term{:} \nterm{valtype} \mid \nterm{struct-body} \term{,} \nterm{ident} \term{:} \nterm{valtype} \\
\end{aligned}
$$

### Expressions

#### Statements
A statement is a type of expression which can be followed by another expression, which is syntactically and semantically it's child.
The type of a statement depends on the type of the statements terminator $\nterm{stmt-end}$, statements without a terminator have the unit result type.

$$
\begin{aligned}
    \nterm{block} &\Coloneqq \term{\{} \; \nterm{stmt}^\ast \; \nterm{stmt-end}^? \; \term{\}} \\
    \nterm{stmt} &\Coloneqq \nterm{expr} \term{;} \\
    \nterm{stmt} &\Coloneqq \term{if} \; \nterm{expr} \; \nterm{block} \; (\term{else} \; \nterm{block})^? \\
    \nterm{stmt} &\Coloneqq \term{loop} \;  \nterm{block} \\
    \nterm{stmt} &\Coloneqq \term{for} \; \nterm{ident} \; \term{in} \; \nterm{expr} \; \nterm{block} \\
    \nterm{stmt} &\Coloneqq \term{for} \; \nterm{ident} \; \term{in} \; \nterm{expr} \term{..} \nterm{expr} \; \nterm{block} \\
    \nterm{stmt} &\Coloneqq \term{let} \; \term{mut} \; \nterm{ident} \; \term{=} \; \nterm{expr} \term{;} \\
    \nterm{stmt} &\Coloneqq \term{let} \; \nterm{ident} \; \term{=} \; \nterm{expr} \term{;} \\
    \nterm{stmt} &\Coloneqq \nterm{lvalue} \; \term{=} \; \nterm{expr} \term{;} \\
    \nterm{stmt} &\Coloneqq \nterm{lvalue} \; \nterm{op-assign} \; \nterm{expr} \term{;} \\
    \nterm{op-assign} &\Coloneqq \textit{See ``op assign" row of the symbols table}  \\
    \nterm{lvalue} &\Coloneqq \nterm{ident} \\
    \nterm{lvalue} &\Coloneqq \nterm{lvalue} \term{.} \nterm{ident} \\
    \nterm{lvalue} &\Coloneqq \nterm{lvalue} \term{[} \nterm{expr} \term{]} \\
    \nterm{stmt-end} &\Coloneqq \term{break} \; \nterm{expr}^? \; \term{;} \\
    \nterm{stmt-end} &\Coloneqq \term{return} \; \nterm{expr}^? \; \term{;} \\
    \nterm{stmt-end} &\Coloneqq \term{continue} \term{;} \\
    \nterm{stmt-end} &\Coloneqq \nterm{expr} \\
\end{aligned}
$$

#### Inline Expressions
Inline Expressions are used in value positions within
 * statements (e.g. assign),
 * other inline expressions (e.g. function call),
 * and certain item definitions (e.g. global variables).

The $\nterm{expr}$ non-terminal represents the "top" or "root" of an inline expression tree.
The $\nterm{expr-bot}$ non-terminal represents the "bottom" of an inline expression tree and include things like literals and function calls.
The $\nterm{expr}$ non-terminal produces $\nterm{expr-bot}$ through fall-through productions (e.g. expr-p7 -> expr-p6) or binary operator productions.
Some productions "reset" an expression top to a bottom, like parenthesis and inline-ifs and in so doing allow for further recursion.

$$
\begin{aligned}
    \nterm{expr} &\Coloneqq \nterm{expr} \; \nterm{binop9} \; \nterm{expr-p8} \mid \nterm{expr-p8} \\
    \nterm{expr-p8} &\Coloneqq \nterm{expr-p8} \; \nterm{binop8} \; \nterm{expr-p7} \mid \nterm{expr-p7} \\
    \nterm{expr-p7} &\Coloneqq \nterm{expr-p7} \; \nterm{binop7} \; \nterm{expr-p6} \mid \nterm{expr-p6} \\
    \nterm{expr-p6} &\Coloneqq \nterm{expr-p6} \; \nterm{binop6} \; \nterm{expr-p5} \mid \nterm{expr-p5} \\
    \nterm{expr-p5} &\Coloneqq \nterm{expr-p5} \; \nterm{binop5} \; \nterm{expr-p4} \mid \nterm{expr-p4} \\
    \nterm{expr-p4} &\Coloneqq \nterm{expr-p4} \; \nterm{binop4} \; \nterm{expr-p3} \mid \nterm{expr-p3} \\
    \nterm{expr-p3} &\Coloneqq \nterm{expr-p3} \; \nterm{binop3} \; \nterm{expr-p2} \mid \nterm{expr-p2} \\
    \nterm{expr-p2} &\Coloneqq \nterm{expr-p2} \; \nterm{binop2} \; \nterm{expr-p1} \mid \nterm{expr-p1} \\
    \nterm{expr-p1} &\Coloneqq \nterm{expr-p1} \; \nterm{binop1} \; \nterm{expr-p0} \mid \nterm{expr-p0} \\
    \nterm{expr-p0} &\Coloneqq \nterm{expr-p0} \; \nterm{binop0} \; \nterm{expr-bot} \mid \nterm{expr-bot} \\
    \nterm{expr-bot} &\Coloneqq \nterm{block} \\
    \nterm{expr-bot} &\Coloneqq \term{(} \; \nterm{expr} \; \term{)} \\
    \nterm{expr-bot} &\Coloneqq \term{if} \; \nterm{expr} \; \nterm{block} \; (\nterm{else} \; \nterm{block})^? \\
    \nterm{expr-bot} &\Coloneqq \term{loop} \;  \nterm{block} \\
    \nterm{expr-bot} &\Coloneqq \nterm{expr} \term{.} \nterm{ident} \\
    \nterm{expr-bot} &\Coloneqq \nterm{expr} \term{[} \nterm{expr} \term{]} \\
    \nterm{expr-bot} &\Coloneqq \nterm{expr} \term{[} \nterm{expr}^? \term{:} \nterm{expr}^? \term{]} \\
    \nterm{expr-bot} &\Coloneqq \nterm{unop} \nterm{expr} \\
    \nterm{expr-bot} &\Coloneqq \nterm{ident} (\term{::} \nterm{ident})^\ast \\
    \nterm{expr-bot} &\Coloneqq \nterm{ident} \term{(} \nterm{expr-args} \term{)} \\
    \nterm{expr-bot} &\Coloneqq \nterm{ident}  \term{.} \nterm{ident} \term{(} \nterm{expr-args} \term{)} \\
    \nterm{expr-args} &\Coloneqq \nterm{expr} \mid \nterm{expr-args} \term{,} \nterm{expr} \\
    \nterm{unop} &\Coloneqq \term{!} \mid \term{-} \mid \term{*} \\
    \nterm{binop0} &\Coloneqq \terms{*}, \terms{/}, \terms{\verb@%@} \\
    \nterm{binop1} &\Coloneqq \terms{+}, \terms{-} \\
    \nterm{binop2} &\Coloneqq \terms{<<}, \terms{>>}, \terms{>>>} \\
    \nterm{binop3} &\Coloneqq \terms{<}, \terms{<=}, \terms{>}, \terms{>=} \\
    \nterm{binop4} &\Coloneqq \terms{==}, \terms{!=} \\
    \nterm{binop5} &\Coloneqq \terms{\&} \\
    \nterm{binop6} &\Coloneqq \terms{\verb@^@} \\
    \nterm{binop7} &\Coloneqq ``\mid" \\
    \nterm{binop8} &\Coloneqq \terms{and} \\
    \nterm{binop9} &\Coloneqq \terms{or} \\
\end{aligned}
$$

### Literals
$$
\begin{aligned}
    \nterm{literal-num} &\Coloneqq \textit{A numeric literal token} \\
    \nterm{literal-str} &\Coloneqq \textit{A string literal token} \\
    \nterm{literal-struct} &\Coloneqq \nterm{ident} \; \terms{\{} \; \nterm{struct-lit-body} \; \terms{\}} \\
    \nterm{struct-lit-body} &\Coloneqq \nterm{struct-lit-entry} \mid \nterm{struct-lit-body} \; \terms{,} \; \nterm{struct-lit-entry} \\
    \nterm{struct-lit-entry} &\Coloneqq \nterm{ident} \; \terms{:} \; \nterm{expr} \\
\end{aligned}
$$