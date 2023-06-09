import Link from "next/link"
import { FaLongArrowAltLeft } from "react-icons/fa"

const BackButton = ({ className }) => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <FaLongArrowAltLeft color="#d14201" />{" "}
      <button
        className={`${className} flex items-center underline text-[#d14201]`}
      >
        Back to home
      </button>
    </Link>
  )
}
export default BackButton
