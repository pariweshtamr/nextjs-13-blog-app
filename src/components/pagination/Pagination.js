const Pagination = ({ items, currentPage, pageSize, onPageChange }) => {
  const pagesCount = Math.ceil(items / pageSize)

  if (pagesCount === 1) return null

  const pages = [...Array(pagesCount).keys()]

  return (
    <div className="mt-10">
      <ul className="flex justify-center gap-2 items-center list-none">
        {pages?.map((page) => (
          <li
            key={page}
            className={
              page === currentPage
                ? "flex justify-center items-center w-[2rem] h-[2rem] border border-solid border-black rounded-full cursor-pointer bg-[#d14201] text-white"
                : "flex justify-center items-center w-[2rem] h-[2rem] border border-solid border-[#d14201] rounded-full cursor-pointer "
            }
            onClick={() => onPageChange(page)}
          >
            <a className="cursor-pointer">{page + 1}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
export default Pagination
