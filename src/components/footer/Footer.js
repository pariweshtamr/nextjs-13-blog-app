const Footer = () => {
  return (
    <footer className="w-full h-[250px] mt-[5rem] bg-[#f8f9fa] py-[2rem]">
      <div className="w-[85%] h-full m-[0_auto] flex justify-between items-center">
        <div className="flex flex-col gap-[.5rem] justify-start h-full">
          <h2 className="mb-[15px] font-bold">About the app</h2>
          <p className="max-w-[425px] text-[#555] text-[15px]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias rem
            beatae, exercitationem ipsum harum tempora vitae molestiae
            voluptatum explicabo iusto doloribus nihil saepe incidunt! Sed
            quibusdam rerum quaerat odit eveniet.
          </p>
        </div>

        <div className="flex flex-col gap-[.5rem] justify-start h-full">
          <h2 className="mb-[15px] font-bold">Contact</h2>
          <span>Phone: +61 0362 736 647</span>
          <span>GitHub: pariwesh7</span>
        </div>

        <div className="flex flex-col gap-[.5rem] h-full">
          <h2 className="mb-[15px] font-bold">Location</h2>
          <span>Country: Australia</span>
        </div>
      </div>

      <p className="text-center p-[1rem] bg-[#f8f9fa]">
        &copy; 2023 | All Rights Reserved | Developed by Pariwesh Tamarkar
      </p>
    </footer>
  )
}
export default Footer
