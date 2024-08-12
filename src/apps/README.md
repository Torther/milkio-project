# Hello Cookbook

This document will be displayed on the homepage of your Cookbook.

#### 失败响应
| 参数名 | 类型 | 描述 |
| --- | --- | --- |
| executeId | string | 执行ID，用于追踪请求 |
| success | boolean | 是否成功 |
| fail | object | 失败信息 |
| fail.code | string | 错误码 |
| fail.message | string | 错误信息 |
| fail.data | any | 错误数据 |