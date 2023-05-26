const Footer = () => {
  return (
    <footer className="w-full h-[400px] mt-[5rem]">
      <div className="w-[85%] h-full m-[0_auto] flex justify-between items-center">
        <div className="flex flex-col gap-[.5rem]">
          <h2 className="mb-[15px] self-start">About the app</h2>
          <p className="max-w-[425px] text-[#555] text-[15px]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias rem
            beatae, exercitationem ipsum harum tempora vitae molestiae
            voluptatum explicabo iusto doloribus nihil saepe incidunt! Sed
            quibusdam rerum quaerat odit eveniet.
          </p>
        </div>

        <div className="flex flex-col gap-[.5rem]">
          <h2 className="mb-[15px] self-start">Contact</h2>
          <span>Phone: +61 0362 736 647</span>
          <span>GitHub: pariwesh7</span>
        </div>

        <div className="flex flex-col gap-[.5rem]">
          <h2 className="mb-[15px] self-start">Location</h2>
          <span>Country: Australia</span>
        </div>
      </div>
    </footer>
  )
}
export default Footer
