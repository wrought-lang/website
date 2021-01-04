---
description: 'The definition of the formal semantics of Wrought source code'
sidebar: 'sidebar'
next: '/spec/wasm-output/'
prev: '/spec/syntax/'
---

# Semantics

**This page is very early in development**

## Elements
The output of the semantic analysis phase is a fully resolved module element.
The logical structure of elements is represented by an abstract syntax, denoted as a context-free grammar.

### Module Element
The module element represents a WebAssembly module and any additional Wrought types or information.

$$
\begin{aligned}
    \nterm{module} &\Coloneqq \nterm{item}^\ast \\ 
    \nterm{item} &\Coloneqq \nterm{import} \mid \nterm{func} \mid \nterm{table} \mid \nterm{mem} \mid \nterm{global} \\ 
    \nterm{item} &\Coloneqq \nterm{struct} \\
\end{aligned}
$$

### Top-Level Elements

### Function-Level Elements

### Element IDs

## Environments

### Environment
An environment is a mapping of identifiers to element IDs.

 * The empty environment
 
 $$\{\}$$
 
 * Derived environment

 $$\mathrm{parent} \thickspace \mathtt{with} \thickspace [ \mathrm{ident} ] = \nterm{element-id} $$

### Prelude Environment

Wrought defines a prelude environment that acts as the baseline that module elements are added to or over.
This is where any WASM features that are exposed as Functions are bound to make them accessible to user code.

Function-like Intrinsics
 * Rotate Left (`rotl`)
 * Rotate Right (`rotr`)
 * Round (`round`)
 * Minimum and Maximum (`min`, `max`)

### Module Environment

## Name Resolution / Validation

## Type Inference

