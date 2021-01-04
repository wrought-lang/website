---
description: 'An introduction to the Wrought programming language, its goals, and initial use cases.'
sidebar: 'sidebar'
next: '/info/why-wrought/'
---

# Overview

The Wrought programming language is an imperative expression language designed to directly match the semantics of WebAssembly.
Its syntax is based on the Rust programming language with deviations to simplify lexical analysis and model WASM more closely.
Wrought offers a small subset of what is available in major multi-paradigm languages and is not designed for large scale production usage.

## Objectives

### 1. Match the semantics of WebAssembly modules
Wrought modules represent WebAssembly modules and can be compiled deterministically into a single WASM file.
Wrought allows and requires users to define imports, exports, functions, and tables directly as they need them.
This means that there is no need for a bundler, defining imports as extern functions, or re-mapping system calls to imports.

### 2. Offer higher-level syntax and semantics on top of WebAssembly
The two existing text encodings of WebAssembly, WAT and WAST, are both very low level and are not easy to read write in.
Wrought higher-level Rust-like syntax and semantics lets programmers
 * use identifiers for parameters and locals, which are resolved by the compiler and converted into local indices;
 * declare variables using let statements inside expressions, which can omit the type if it can be inferred;
 * use standard binary and unary operators without specifying a sign extension, because it can be determined from the operand types;
 * use pointer and slice types to simplify the process of loading and storing to memory and better validate usage of addresses into the memory; 
 * use constructs like for-in loops and match expressions.

## Use Cases

### 1. Writing and compiling trivial examples
When users are learning about WebAssembly, a format like Wrought that is very literal and direct in how it represents logic,
while being easier to understand than WAT/WAST, will provide a good playground for learning and exploring.
This would make Wrought a great choice for the "hello, world!" of the WASM world.

### 2. Creating small WASM modules within larger projects
Some projects may benefit from the ability to compile portions of the project into WebAssembly but neither need nor want to take on a large language like Rust or C++.
In this case, Wrought lets you quickly start experimenting with the benefits of WASM or even fully realize them in a simpler and more direct way.

### 3. De-compiling WASM modules
It will be possible to de-compile WebAssembly modules into Wrought source files.
This could be a valuable tool for reverse engineering, debugging, or understanding WASM.

## Why is it called Wrought?

The name is Wrought as in wrought iron (which rusts easily) and stands for WebAssembly, Rust, ...
