import { BsArrowLeft, BsArrowRight } from "react-icons/bs"
const Pagination = ({ items, currentPage, pageSize, setCurrentPage }) => {
  const pagesCount = Math.ceil(items / pageSize)

  if (pagesCount === 1) return null

  // const pages = [...Array(pagesCount).keys()]

  const prevPage = () => {
    if (currentPage !== 0) {
      setCurrentPage((prev) => currentPage - 1)
    }
  }

  const nextPage = () => {
    if (currentPage !== pagesCount - 1) {
      setCurrentPage((prev) => currentPage + 1)
    }
  }

  return (
    <div className="mt-10">
      <ul className="flex justify-center gap-6 items-center list-none">
        <li
          className="bg-[#F8F9FA] p-3 rounded-full cursor-pointer hover:shadow-[2px_5px_27px_-8px_rgba(0,0,0,0.4)]"
          onClick={prevPage}
        >
          <BsArrowLeft size={20} />
        </li>

        <div className="flex gap-2 items-center justify-center">
          <li className="flex justify-center items-center w-[.5rem] sm:w-[.5rem] h-[.5rem] sm:h-[.5rem] sm:text-xs rounded-full bg-[#d14201] text-white"></li>
          <li className="flex justify-center items-center w-[1rem] sm:w-[1rem] h-[1rem] sm:h-[1rem] sm:text-xs rounded-full bg-[#d14201] text-white"></li>

          <li
            className={
              "flex justify-center items-center w-[2rem] sm:w-[1.5rem] h-[2rem] sm:h-[1.5rem] sm:text-xs rounded-full cursor-pointer bg-[#d14201] text-white"
            }
          >
            <a className="cursor-pointer">{currentPage + 1}</a>
          </li>

          <li className="flex justify-center items-center w-[1rem] sm:w-[1rem] h-[1rem] sm:h-[1rem] sm:text-xs rounded-full bg-[#d14201] text-white"></li>
          <li className="flex justify-center items-center w-[.5rem] sm:w-[.5rem] h-[.5rem] sm:h-[.5rem] sm:text-xs rounded-full bg-[#d14201] text-white"></li>
        </div>

        <li
          className="bg-[#F8F9FA] p-3 rounded-full cursor-pointer hover:shadow-[2px_5px_27px_-8px_rgba(0,0,0,0.4)]"
          onClick={nextPage}
        >
          <BsArrowRight size={20} />
        </li>
      </ul>
    </div>
  )
}
export default Pagination
