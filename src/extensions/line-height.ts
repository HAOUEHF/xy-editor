import { Extension, Attributes, Editor } from '@tiptap/core'
import { useLineHeight } from '@/hooks/index'
import { h } from '@stencil/core'
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    lineHeight: {
      setLineHeight: (lineHeight: string) => ReturnType
    }
  }
}

const { commandsLineHeight, isActive } = useLineHeight()

const LineHeight = Extension.create({
  name: 'lineHeight',

  addOptions() {
    return {
      types: ['paragraph', 'heading'],

      button({ editor, t }: { editor: Editor; t: (...args: any[]) => string }) {
        return {
          props: {
            command: (val: string) => {
              editor.chain().focus().setLineHeight(val).run()
            },
            icon: 'LineHeightIcon',
            name: t('extensions.lineHeight'),
            activeIcon: 'LineHeightIcon',
            activeValue: isActive(editor.state, editor.storage.lineHeight.lineHeight).value || '1.5',
            // options: [
            //   {
            //     label: '热门城市',
            //     group: 'city',
            //     items: [
            //       {
            //         value: 'Shanghai',
            //         label: '上海'
            //       },
            //       {
            //         value: 'Beijing',
            //         label: '北京'
            //       }
            //     ]
            //   },
            //   {
            //     label: '城市名',
            //     group: 'city',
            //     items: [
            //       {
            //         value: 'Chengdu',
            //         label: '成都'
            //       },
            //       {
            //         value: 'Shenzhen',
            //         label: '深圳'
            //       },
            //       {
            //         value: 'Guangzhou',
            //         label: '广州'
            //       },
            //       {
            //         value: 'Dalian',
            //         label: '大连'
            //       }
            //     ]
            //   }
            // ],
            options: [
              { label: '1.0', value: '1' },
              { label: '1.5', value: '1.5' },
              { label: '2.0', value: '2' },
              { label: '2.5', value: '2.5' },
              { label: '3.0', value: '3' }
            ],
            isDropdown: true,
            render: () => {
              return h('xy-dropdown', {}, [
                h('xy-icon', { name: 'LineHeightIcon' }),
                h('xy-dropdown-menu', { slot: 'dropdown' }, [
                  // Group 1
                  h('xy-dropdown-group', { label: 'Group 1' }, [
                    h('xy-dropdown-item', { icon: 'BoldIcon', data: { name: 'hello world', age: 18 } }, 'Item 1'),
                    h('xy-dropdown-item', { disabled: true }, 'Item 2')
                  ]),
                  // Group 2
                  h('xy-dropdown-group', { label: 'Group 2' }, [
                    h('xy-dropdown-item', null, 'Item 3'),
                    h('xy-popover', { trigger: 'hover', placement: 'right' }, [
                      h('xy-dropdown-item', { slot: 'trigger' }, 'trigger'),
                      h('div', null, [
                        h('xy-dropdown-group', { label: 'Group 1' }, [
                          h('xy-dropdown-item', { icon: 'BoldIcon' }, 'Item 1'),
                          h('xy-dropdown-item', { disabled: true }, 'Item 2')
                        ])
                      ])
                    ])
                  ])
                ])
              ])
            }
          }
        }
      }
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: '1.5',
            parseHTML: element => {
              return element.style.lineHeight
            },
            renderHTML: attributes => {
              if (!attributes.lineHeight) return {}
              this.storage.lineHeight = attributes.lineHeight
              return {
                style: `line-height: ${attributes.lineHeight}`
              }
            }
          }
        } as Attributes
      }
    ]
  },
  addCommands() {
    return {
      setLineHeight: (lineHeight: string) => commandsLineHeight(lineHeight)
    }
  }
})

export default LineHeight
