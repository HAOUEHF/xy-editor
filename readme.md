# Stencil 生命周期方法

| **阶段**       | **方法**                  | **触发时机**                                                                 | **作用**                                                                                         | **注意事项**                                         |
|-----------------|---------------------------|------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|-----------------------------------------------------|
| **构造阶段**   | `constructor()`           | 组件实例化时调用                                                            | 初始化组件的属性和状态。避免访问 DOM，因为组件尚未挂载。                                         | 不适合进行复杂操作或 DOM 操作。                    |
| **加载阶段**   | `componentWillLoad()`     | 组件加载并即将渲染到 DOM 之前调用                                            | 执行初始化逻辑，如加载数据、设置状态等。支持异步操作，返回的 `Promise` 会被等待。                | 不适合访问 DOM 元素，因为尚未渲染完成。            |
|                 | `componentDidLoad()`     | 组件首次渲染完成后调用                                                      | 用于执行 DOM 操作、初始化第三方库等。                                                            | 仅在首次渲染后触发，适合访问已渲染的 DOM。         |
| **更新阶段**   | `componentWillUpdate()`   | 组件的状态或属性更新并即将重新渲染时调用                                     | 在组件重新渲染前执行准备逻辑，例如加载新数据。                                                   | 不会在首次渲染时触发，仅在后续更新中触发。         |
|                 | `componentDidUpdate()`   | 组件重新渲染完成后调用                                                      | 适合执行依赖最新状态或 DOM 的操作。                                                              | 仅在更新渲染后触发，不适合初始化操作。             |
| **卸载阶段**   | `disconnectedCallback()`  | 组件从 DOM 中移除时调用                                                     | 清理资源，如定时器、事件监听器或销毁第三方库。                                                   | 确保清理操作完整，避免内存泄漏。                   |
| **渲染阶段**   | `render()`                | 每次组件渲染时调用，包括首次渲染和更新渲染                                   | 定义组件的 UI 结构，返回 JSX。                                                                   | 避免在 `render()` 中执行复杂逻辑或副作用操作。     |
| **属性监听**   | `@Watch(propName)`        | 当 `@Prop` 或 `@State` 属性发生变化时触发                                    | 执行依赖属性变化的逻辑。例如，数据变化时重新加载相关内容。                                        | 需显式声明要监听的属性名。                         |

---

## **Stencil 生命周期方法的执行顺序**

1. `constructor()`
2. `componentWillLoad()`
3. `render()`
4. `componentDidLoad()`
5. **（状态或属性更新时）**:
   - `componentWillUpdate()`
   - `render()`
   - `componentDidUpdate()`
6. `disconnectedCallback()` （组件卸载时触发）

---

# Stencil 父子组件生命周期表

| **阶段**           | **父组件方法**          | **子组件方法**            | **说明**                                                                                  |
|---------------------|-------------------------|---------------------------|------------------------------------------------------------------------------------------|
| **构造阶段**       | `constructor()`         | `constructor()`           | 父组件和子组件的构造函数分别初始化。                                                     |
| **加载阶段**       | `componentWillLoad()`   | `componentWillLoad()`     | 父组件和子组件分别在渲染前执行加载逻辑，**子组件先于父组件渲染完成**。                   |
|                     | `render()`             | `render()`                | 子组件的 `render` 方法先执行，随后父组件的 `render` 执行。                               |
| **加载完成阶段**   | `componentDidLoad()`    | `componentDidLoad()`      | 父组件的 `componentDidLoad` 方法会在其所有子组件的 `componentDidLoad` 方法完成后触发。  |
| **更新阶段**       | `componentWillUpdate()` | `componentWillUpdate()`   | 当状态或属性更新时，子组件的更新生命周期优先于父组件执行。                               |
|                     | `render()`             | `render()`                | 子组件的更新渲染会先执行，随后父组件完成更新渲染。                                       |
|                     | `componentDidUpdate()` | `componentDidUpdate()`    | 子组件的更新完成方法会先触发，随后父组件触发。                                           |
| **卸载阶段**       | `disconnectedCallback()` | `disconnectedCallback()` | 父组件从 DOM 移除时，先触发子组件的卸载回调，再触发父组件的卸载回调。                   |
