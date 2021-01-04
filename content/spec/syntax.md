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
| int types     | $\term{i8}, \term{i16}, \term{i32}, \term{i64}, \term{s8}, \term{s16}, \term{s32}, \term{s64}, \term{u8}, \term{u16}, \term{u32}, \term{u64}$ |
| float types   | $\term{f32}, \term{f64}$ |
| misc          | $\term{as}, \term{let}$, $\term{bool}$, $\term{or}$, $\term{and}$ |

### Symbols and Operators

| Kind       | Tokens |
| ---------- | ------ |
| paired     | $\terms{[}, \terms{]}, \terms{(}, \terms{)}, \terms{\{}, \terms{\}}$ |
| delimiters | $\terms{,}, \terms{.}, \terms{::}, \terms{;}, \terms{@}$ |
| misc       | $\terms{..}, \terms{:}, \terms{->}$ |
| arithmetic | $\terms{+}, \terms{-}, \terms{*}, \terms{/}, \terms{\verb@%@}$ |
| bitwise    | $\terms{!}, ``\vert", \terms{\verb@&@}, \terms{\verb@^@}, \terms{>>}, \terms{>>}, \terms{>>}, \terms{>>>}$ |
| op assign  | $``\vert\term{=}", \terms{\verb@&=@}, \terms{\verb@^=@}, \terms{+=}, \terms{-=}, \terms{*=}, \terms{/=}$ |
| comparison | $\terms{<}, \terms{<=}, \terms{>}, \terms{>=}, \terms{==}, \terms{!=}$ |

### Identifiers
$$
/\verb@[_a-zA-Z][_a-zA-Z0-9]*@/
$$

### Numeric Literals
* Decimal - $/\verb@[-+]?[1-9][0-9]*(\.[0-9]*)@/$
* Binary - $/\verb@0b[01]+@/$
* Hexadecimal - $/\verb@0x[0-9a-fA-F][0-9a-fA-F]@/$


## Grammar
The grammar is written in Backus-Naur Form, with the addition of the Kleene-Star operator.
The grammar implicitly allows white-space and comment tokens to be added between the tokens of any production rule,
these are omitted from the parse tree and abstract syntax tree.

As a convenience, some groups of terminals can be referred to using non-terminal-like names.

$$
\begin{aligned}
    \nterm{ident} &\Coloneqq \textit{An identifier token} \\
    \nterm{literal-num} &\Coloneqq \textit{A numeric literal token} \\
    \nterm{literal-str} &\Coloneqq \textit{A string literal token} \\
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
    \nterm{pointer-val} &\Coloneqq \term{Ptr} \term{[} \nterm{memtype} \nterm{p-options} \term{]} \mid \term{Slice} \term{[} \nterm{memtype} \nterm{p-options} \term{]} \\
    \nterm{p-options} &\Coloneqq \lambda \mid  \term{,} \nterm{num} \mid  \term{,} \nterm{num} \term{,} \nterm{num} \mid  \term{,} \nterm{num} \term{,} \nterm{num} \term{,} \nterm{num} \\
    \nterm{num} &\Coloneqq \nterm{literal-num} \\
\end{aligned}
$$

#### Memory Types
The types that can be loaded from and stored to the WASM linear memory (a superset of the Value Types).


$$
\begin{aligned}
    \nterm{memtype} &\Coloneqq \nterm{valtype} \mid \nterm{memonly-val} \\
    \nterm{memonly-val} &\Coloneqq \term{i8} \mid \term{i16} \mid \term{u8} \mid \term{u16} \mid \term{s8} \mid \term{s16} \\
\end{aligned}
$$

#### Function Types
Wrought functions are represented as a type from zero or more value types to a Result Type.
A function with an empty result can omit the arrow clause or use the unit type.

$$
\begin{aligned}
    \nterm{fntype} &\Coloneqq \term{fn} \term{(} \nterm{valtype}^\ast \term{)} \term{->} \nterm{restype} \\
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
    \nterm{import} &\Coloneqq \term{from} \nterm{ident} \term{import} \nterm{ident} \term{:} \nterm{importtype} \term{;} \\
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
    \nterm{func} &\Coloneqq \nterm{func-sig} \term{\{} \nterm{stmt} \term{\}} \\
    \nterm{func-sig} &\Coloneqq \term{fn} \nterm{ident} \term{(} \nterm{func-args} \term{)} \term{->} \nterm{restype} \\
    \nterm{func-sig} &\Coloneqq \term{fn} \nterm{ident} \term{(} \nterm{func-args} \term{)} \\
    \nterm{func-args} &\Coloneqq \nterm{ident} \term{:} \nterm{valtype} \mid \nterm{func-args} \term{,} \nterm{ident} \term{:} \nterm{valtype} \\
\end{aligned}
$$

#### Tables and Memory

$$
\begin{aligned}
    \nterm{table} &\Coloneqq \term{table} \; \nterm{ident} \term{[} \nterm{literal-num} \term{]} \term{;} \\
    \nterm{mem} &\Coloneqq \term{memory} \; \nterm{ident} \term{[} \nterm{literal-num} \term{]} \term{;} \\
    \nterm{ident-array} &\Coloneqq \term{[} \nterm{idents} \term{]} \\
    \nterm{exprs} &\Coloneqq \nterm{inline-expr} \mid \nterm{nums} \term{,} \nterm{inline-expr} \\
\end{aligned}
$$

#### Globals and Statics

$$
\begin{aligned}
    \nterm{global} &\Coloneqq \term{let} \nterm{ident} \term{=} \nterm{literal-num} \term{;} \\
    \nterm{global} &\Coloneqq \term{let} \; \term{mut} \nterm{ident} \term{=} \nterm{literal-num} \term{;} \\
    \nterm{static} &\Coloneqq \term{let} \; \nterm{ident} \; \term{@} \; \nterm{static-loc} \;  \term{=} \nterm{static-val} \term{;} \\
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
    \nterm{stmt} &\Coloneqq \nterm{stmt-entry} \nterm{stmt} \\
    \nterm{stmt} &\Coloneqq \nterm{stmt-end} \\
    \nterm{stmt} &\Coloneqq \lambda \\
    \nterm{stmt-entry} &\Coloneqq \nterm{expr} \term{;} \\
    \nterm{stmt-entry} &\Coloneqq \term{if} \; \nterm{expr} \; \term{\{} \nterm{stmt} \term{\}} \\
    \nterm{stmt-entry} &\Coloneqq \term{if} \; \nterm{expr} \; \term{\{} \nterm{stmt} \term{\}} \; \term{else} \;  \term{\{} \nterm{stmt} \term{\}} \\
    \nterm{stmt-entry} &\Coloneqq \term{for} \; \nterm{ident} \; \term{in} \; \nterm{expr} \; \term{\{} \nterm{stmt} \term{\}} \\
    \nterm{stmt-entry} &\Coloneqq \term{for} \; \nterm{ident} \; \term{in} \; \nterm{expr} \term{..} \nterm{expr} \; \term{\{} \nterm{stmt} \term{\}} \\
    \nterm{stmt-entry} &\Coloneqq \term{loop} \;  \term{\{} \nterm{stmt} \term{\}} \\
    \nterm{stmt-entry} &\Coloneqq \term{let} \; \term{mut} \; \nterm{ident} \; \term{=} \; \nterm{expr} \term{;} \\
    \nterm{stmt-entry} &\Coloneqq \term{let} \; \nterm{ident} \; \term{=} \; \nterm{expr} \term{;} \\
    \nterm{stmt-entry} &\Coloneqq \nterm{lvalue} \; \term{=} \; \nterm{expr} \term{;} \\
    \nterm{lvalue} &\Coloneqq \nterm{ident} \\
    \nterm{lvalue} &\Coloneqq \nterm{lvalue} \term{.} \nterm{ident} \\
    \nterm{lvalue} &\Coloneqq \nterm{lvalue} \term{[} \nterm{expr} \term{]} \\
    \nterm{stmt-end} &\Coloneqq \term{break} \term{;} \\
    \nterm{stmt-end} &\Coloneqq \term{continue} \term{;} \\
    \nterm{stmt-end} &\Coloneqq \term{return} \; \nterm{expr} \term{;} \\
    \nterm{stmt-end} &\Coloneqq \nterm{expr} \\
\end{aligned}
$$

#### Inline Expressions
Inline Expressions are used in various value positions,
like function call arguments, right-hand side of assignments, and within unary or binary operations.

$$
\begin{aligned}
    \nterm{expr} &\Coloneqq \term{\{} \nterm{stmt} \term{\}} \\
    \nterm{expr} &\Coloneqq \term{(} \nterm{expr} \term{)} \\
    \nterm{expr} &\Coloneqq \term{if} \; \nterm{expr} \; \term{\{} \nterm{expr} \term{\}} \\
    \nterm{expr} &\Coloneqq \term{if} \; \nterm{expr} \; \term{\{} \nterm{expr} \term{\}} \; \term{else} \; \term{\{} \nterm{expr} \term{\}} \\
    \nterm{expr} &\Coloneqq \nterm{ident} (\term{::} \nterm{ident})^\ast \\
    \nterm{expr} &\Coloneqq \nterm{expr} \term{.} \nterm{ident} \\
    \nterm{expr} &\Coloneqq \nterm{expr} \term{[} \nterm{expr} \term{]} \\
    \nterm{expr} &\Coloneqq \nterm{unary-op} \nterm{expr} \\
    \nterm{expr} &\Coloneqq \nterm{ident} \term{(} \nterm{expr-args} \term{)} \\
    \nterm{expr-args} &\Coloneqq \nterm{expr} \mid \nterm{expr-args} \term{,} \nterm{expr} \\
    \nterm{unary-op} &\Coloneqq \term{!} \mid \term{-} \mid \term{*} \\
\end{aligned}
$$

The expressions of binary operators are defined below and have grammatically encoded precedence.

$$
\begin{aligned}
    \nterm{expr} &\Coloneqq \nterm{expr-p9} \\
    \nterm{expr-p9} &\Coloneqq \nterm{expr-p9} \; \nterm{op-prec9} \; \nterm{expr-p8} \mid \nterm{expr-p8} \\
    \nterm{expr-p8} &\Coloneqq \nterm{expr-p8} \; \nterm{op-prec8} \; \nterm{expr-p7} \mid \nterm{expr-p7} \\
    \nterm{expr-p7} &\Coloneqq \nterm{expr-p7} \; \nterm{op-prec7} \; \nterm{expr-p6} \mid \nterm{expr-p6} \\
    \nterm{expr-p6} &\Coloneqq \nterm{expr-p6} \; \nterm{op-prec6} \; \nterm{expr-p5} \mid \nterm{expr-p5} \\
    \nterm{expr-p5} &\Coloneqq \nterm{expr-p5} \; \nterm{op-prec5} \; \nterm{expr-p4} \mid \nterm{expr-p4} \\
    \nterm{expr-p4} &\Coloneqq \nterm{expr-p4} \; \nterm{op-prec4} \; \nterm{expr-p3} \mid \nterm{expr-p3} \\
    \nterm{expr-p3} &\Coloneqq \nterm{expr-p3} \; \nterm{op-prec3} \; \nterm{expr-p2} \mid \nterm{expr-p2} \\
    \nterm{expr-p2} &\Coloneqq \nterm{expr-p2} \; \nterm{op-prec2} \; \nterm{expr-p1} \mid \nterm{expr-p1} \\
    \nterm{expr-p1} &\Coloneqq \nterm{expr-p1} \; \nterm{op-prec1} \; \nterm{expr-p0} \mid \nterm{expr-p0} \\
    \nterm{expr-p0} &\Coloneqq \nterm{expr-p0} \; \nterm{op-prec0} \; \nterm{expr} \mid \nterm{expr} \\
    \nterm{op-prec0} &\Coloneqq \terms{*}, \terms{/}, \terms{\verb@%@} \\
    \nterm{op-prec1} &\Coloneqq \terms{+}, \terms{-} \\
    \nterm{op-prec2} &\Coloneqq \terms{<<}, \terms{>>}, \terms{>>>} \\
    \nterm{op-prec3} &\Coloneqq \terms{<}, \terms{<=}, \terms{>}, \terms{>=} \\
    \nterm{op-prec4} &\Coloneqq \terms{==}, \terms{!=} \\
    \nterm{op-prec5} &\Coloneqq \terms{\&} \\
    \nterm{op-prec6} &\Coloneqq \terms{\verb@^@} \\
    \nterm{op-prec7} &\Coloneqq ``\mid" \\
    \nterm{op-prec8} &\Coloneqq \terms{and} \\
    \nterm{op-prec9} &\Coloneqq \terms{or} \\
\end{aligned}
$$
