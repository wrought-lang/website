---
description: 'The definition of the lexical structure of Wrought source code'
sidebar: 'spec'
next: '/spec/semantics/'
---

# Syntax

## Tokens
The following paragraphs define, in precedence order, the kinds of tokens defined in Wrought.
Wrought source code is split into tokens by repeatedly consuming the longest string of characters that matches a token rule,
and tie-breaking by precedence order.

### Comments
Wrought allows only single-line double-slash prefixed comments.
$$
\nterm{comment} \Coloneqq \verb@//[^\n]*@
$$

### String Literals
Wrought accepts two kinds of string literal tokens:
 * Standard Strings - which match the syntax of JSON strings as defined in ECMA-404
 * Raw Strings - defined as $\term{r}\term{\#}^n\term{"}$, a sequence of characters not matching $\term{"}\term{\#}^n$, and ended by $\term{"}\term{\#}^n$

### Whitespace
Wrought treats sequences of contiguous whitespace characters as a whitespace token.
$$
\nterm{ws} \Coloneqq \verb@[ \n\t\f]+@
$$

### Keywords

| Kind          | Tokens |
| ------------- | ------ |
| module        | $\term{export}, \term{import}, \term{from}, \term{fn}, \term{table}, \term{mem}$ |
| control       | $\term{if}, \term{for}, \term{in}, \term{loop}, \term{break}, \term{continue}, \term{return}$ |
| pointer types | $ \term{Ptr}, \term{Slice}$ |
| int types     | $\term{i8}, \term{i16}, \term{i32}, \term{i64}, \term{s8}, \term{s16}, \term{s32}, \term{s64}, \term{u8}, \term{u16}, \term{u32}, \term{u64}$ |
| float types   | $\term{f32}, \term{f64}$ |
| misc          | $\term{as}, \term{let}$ |

### Symbols and Operators

| Kind       | Tokens |
| ---------- | ------ |
| paired     | $\terms{[}, \terms{]}, \terms{(}, \terms{)}, \terms{\{}, \terms{\}}$ |
| delimiters | $\terms{,}, \terms{.}, \terms{::}, \terms{;}$ |
| misc       | $\terms{..}, \terms{:}, \terms{->}$ |
| arithmetic | $\terms{+}, \terms{+=}, \terms{-}, \terms{-=}, \terms{*}, \terms{*=}, \terms{/}, \terms{/=}$ |
| bitwise    | $``\vert", ``\vert\term{=}", \terms{\verb@^@}, \terms{\verb@^=@}, \terms{\verb@&@}, \terms{\verb@&=@}$ |
| comparison | $\terms{<}, \terms{<=}, \terms{>}, \terms{>=}, \terms{==}, \terms{!=}$ |

### Identifiers
Wrought identifiers are made up of one underscore or letter followed by zero or more letters, underscores, or digits.

$$
\nterm{ident} \coloneqq \verb@[_a-zA-Z][_a-zA-Z0-9]*@
$$

### Numeric Literals
$$
\begin{aligned}
    \nterm{literal-num} &\Coloneqq \verb@[-+]?[1-9][0-9]*(\.[0-9]*)@ \\ 
    \nterm{literal-num} &\Coloneqq \verb@0b[01]+@ \\
    \nterm{literal-num} &\Coloneqq \verb@0x[0-9a-fA-F][0-9a-fA-F]@ \\
\end{aligned}
$$


## Grammar
The Wrought language is defined using a context-free grammar where the terminals are tokens produced by the lexer.
The grammar is written in Backus-Naur Form, with the addition of the Kleene-Star operator.
The grammar implicitly allows white-space and comment tokens to be added between the tokens of any production rule,
these are omitted from the parse tree and abstract syntax tree.

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
    \nterm{basic-val} &\Coloneqq \term{i32} \mid \term{i64} \mid \term{u32} \mid \term{u64} \mid \term{s32} \mid \term{s64} \mid\term{f32} \mid \term{f64} \\
    \nterm{pointer-val} &\Coloneqq \term{Ptr} \term{[} \nterm{memtype} \nterm{p-options} \term{]} \mid \term{Slice} \term{[} \nterm{memtype} \nterm{p-options} \term{]} \\
    \nterm{p-options} &\Coloneqq \lambda \mid  \term{,} \nterm{NNI} \mid  \term{,} \nterm{NNI} \term{,} \nterm{NNI} \mid  \term{,} \nterm{NNI} \term{,} \nterm{NNI} \term{,} \nterm{NNI} \\
    \nterm{NNI} &\Coloneqq \textit{non-negative integer} \\
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
The non-terminal block-expr is defined in \ref{grammar-expression}.

$$
\begin{aligned}
    \nterm{func} &\Coloneqq \nterm{func-sig} \term{\{} \nterm{block-expr} \term{\}} \\
    \nterm{func-sig} &\Coloneqq \term{fn} \nterm{ident} \term{(} \nterm{func-args} \term{)} \term{->} \nterm{restype} \\
    \nterm{func-sig} &\Coloneqq \term{fn} \nterm{ident} \term{(} \nterm{func-args} \term{)} \\
    \nterm{func-args} &\Coloneqq \nterm{ident} \term{:} \nterm{valtype} \mid \nterm{func-args} \term{,} \nterm{ident} \term{:} \nterm{valtype} \\
\end{aligned}
$$

#### Table

$$
\begin{aligned}
    \nterm{table} &\Coloneqq \term{table} \nterm{ident} \term{[} \nterm{literal-num} \term{]} \nterm{table-init}? \term{;} \\
    \nterm{table-init} &\Coloneqq \term{=} \term{[} \nterm{table-sections} \term{]} \term{;} \\
    \nterm{table-sections} &\Coloneqq \nterm{table-section} \mid \nterm{table-sections} \term{,} \nterm{table-section} \\
    \nterm{table-section} &\Coloneqq \nterm{literal-num} \term{:} \nterm{ident} \\
\end{aligned}
$$

#### Memory

$$
\begin{aligned}
    \nterm{mem} &\Coloneqq \term{memory} \nterm{ident} \term{[} \nterm{literal-num} \term{]} \nterm{mem-init}? \term{;} \\
    \nterm{mem-init} &\Coloneqq \term{=} \term{[} \nterm{mem-sections} \term{]} \term{;} \\
    \nterm{mem-sections} &\Coloneqq \nterm{mem-section} \mid \nterm{mem-sections} \term{,} \nterm{mem-section} \\
    \nterm{mem-section} &\Coloneqq \nterm{literal-num} \term{:} \nterm{literal-num} \mid \nterm{literal-num} \term{:} \nterm{literal-str} \\
\end{aligned}
$$

#### Global

$$
\begin{aligned}
    \nterm{global} &\Coloneqq \term{let} \nterm{ident} \term{=} \nterm{literal-num} \term{;} \\
    \nterm{global} &\Coloneqq \term{let} \thickspace \term{mut} \nterm{ident} \term{=} \nterm{literal-num} \term{;} \\
\end{aligned}
$$

#### Struct

$$
\begin{aligned}
    \nterm{struct} &\Coloneqq \term{struct} \nterm{ident} \term{\{} \nterm{struct-body} \term{\}} \\
    \nterm{struct-body} &\Coloneqq \nterm{ident} \term{:} \nterm{valtype} \mid \nterm{struct-body} \term{,} \nterm{ident} \term{:} \nterm{valtype} \\
\end{aligned}
$$

### Expressions
There are two main distinct kinds of expressions:

 * Statements - Expressions within a pair of braces which can include loops and arbitrary control structures,
 * Inline Expressions - Expressions used in various value positions like function call arguments, right-hand side of assignments, and within unary or binary operations.

#### Statements

$$
\begin{aligned}
    \nterm{stmt} &\coloneqq \nterm{stmt-expr}^\ast \nterm{inline-expr}? \\
    \nterm{stmt-expr} &\Coloneqq \nterm{inline-expr} \term{;} \\
    \nterm{stmt-expr} &\Coloneqq \term{if} \nterm{inline-expr} \term{\{} \nterm{stmt} \term{\}} \\
    \nterm{stmt-expr} &\Coloneqq \term{if} \nterm{inline-expr} \term{\{} \nterm{stmt} \term{\}} \thickspace  \term{else} \thickspace  \term{\{} \nterm{stmt} \term{\}} \\
    \nterm{stmt-expr} &\Coloneqq \term{for} \nterm{ident} \term{in} \nterm{ident} \term{\{} \nterm{stmt} \term{\}} \\
    \nterm{stmt-expr} &\Coloneqq \term{for} \nterm{ident} \term{in} \nterm{inline-expr} \term{..} \nterm{inline-expr} \term{\{} \nterm{stmt} \term{\}} \\
    \nterm{stmt-expr} &\Coloneqq \term{loop} \thickspace  \term{\{} \nterm{stmt} \term{\}} \\
    \nterm{stmt-expr} &\Coloneqq \term{let} \nterm{ident} \term{=} \nterm{inline-expr} \term{;} \\
    \nterm{stmt-expr} &\Coloneqq \term{let} \thickspace \term{mut} \nterm{ident} \term{=} \nterm{inline-expr} \term{;} \\
    \nterm{stmt-expr} &\Coloneqq \term{break} \term{;} \\
    \nterm{stmt-expr} &\Coloneqq \term{continue} \term{;} \\
    \nterm{stmt-expr} &\Coloneqq \term{return} \thickspace \nterm{expr} \term{;} \\
\end{aligned}
$$

#### Inline Expressions

$$
\begin{aligned}
    \nterm{inline-expr} &\Coloneqq \nterm{inline-if} \\
    \nterm{inline-expr} &\Coloneqq \term{\{} \nterm{block-expr} \term{\}} \\
    \nterm{inline-expr} &\Coloneqq \term{(} \nterm{inline-expr} \term{)} \\
    \nterm{inline-if} &\Coloneqq \term{if} \nterm{inline-expr} \term{\{} \nterm{expr} \term{\}} \\
    \nterm{inline-if} &\Coloneqq \term{if} \nterm{inline-expr} \term{\{} \nterm{expr} \term{\}} \thickspace \term{else} \thickspace \term{\{} \nterm{expr} \term{\}} \\
\end{aligned}
$$

#### Literals

$$
\begin{aligned}
    \nterm{literal} &\Coloneqq \nterm{literal-str} \mid \nterm{literal-num} \\
    \nterm{literal-num} &\Coloneqq \nterm{literal-decimal} \mid \nterm{literal-hex} \mid \nterm{literal-bin} \\
\end{aligned}
$$