import JoditEditor from "jodit-react"

const Jodit = ({ editor, config }) => {
  return <JoditEditor ref={editor} config={config} />
}
export default Jodit
