import { CommandProps, Editor, mergeAttributes, Node } from "@tiptap/core"
import type { ParseRule } from "@tiptap/pm/model"
// import type { Node as ProseMirrorNode } from "@tiptap/pm/model"
import { PluginKey } from "@tiptap/pm/state"
import {Heading} from '@tiptap/extension-heading'

export type FileChipOptions = {
  HTMLAttributes: Record<string, any>
  // renderLabel: (props: { options: FileChipOptions; node: ProseMirrorNode }) => string
}

export const FileChipPluginKey = new PluginKey("filechip")
export const FileChip = Heading.extend<FileChipOptions>({
  name: "span",

  group: "inline",

  inline: true,

  addAttributes() {
    return {
      fsPath: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-fsPath"),
        renderHTML: (attributes) => {
          if (!attributes.fsPath) {
            return {}
          }

          return {
            "data-fsPath": attributes.fsPath,
          }
        },
      },

      name: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-name"),
        renderHTML: (attributes) => {
          if (!attributes.name) {
            return {}
          }

          return {
            "data-name": attributes.name,
          }
        },
      },
    }
  },

  parseHTML(this: {
    name: string
    options: {}
    storage: any
    parent: (() => readonly ParseRule[] | undefined) | undefined
    editor?: Editor | undefined
  }) {
    console.log("parseHTML called. this:", this)
    return [
      {
        tag: "span",
      },
    ]
  },

  renderText({ node }) {
    console.log('render text called')
    return `uri://${node.attrs.fsPath}`
  },

  renderHTML({ node, HTMLAttributes }) {
    console.log("renderHTML called. node:", node)
    console.log("HTMLAttributes: ", HTMLAttributes)
    return ["span", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), node.attrs.name]
  },
})