export default function HeirarchyGraphic() {
  return (
    <figure>
      <div>
        <div className="not-prose text-pretty text-sm">
          <div className="mx-auto grid w-image-width aspect-video grid-cols-8">
            <div className="col-span-4 grid grid-rows-4 pr-4 md:col-span-3">
              <div className="flex flex-col justify-center text-right md:py-2">
                <p className="text-base font-bold">Head of Department</p>
                <p className="text-xs">Monitor overall activities</p>
              </div>
              <div className="flex flex-col justify-center py-2 text-right">
                <p className="text-base font-bold">Core Managers</p>
                <p className="text-xs">
                  Manage team leaders, teach scam techniques, and track
                  important scam targets
                </p>
              </div>
              <div className="flex flex-col justify-center py-2 text-right">
                <p className="text-base font-bold">Team Leaders</p>
                <p className="text-xs">
                  Discipline new scammers, teach basic scam techniques, track
                  scam targets
                </p>
              </div>
              <div className="flex flex-col justify-center py-2 text-right">
                <p className="text-base font-bold">Scammers</p>
                <p className="text-xs">
                  Screen scam targets on social media, establish relationship
                  with scam targets
                </p>
              </div>
            </div>
            <div className="col-span-4 md:col-span-5">
              <div className="grid h-full grid-rows-4 place-items-center font-base text-lg font-bold [clip-path:polygon(70%_0%,_70%_25%,_100%_100%,_0%_100%,_30%_25%,_30%_0%)]">
                <div className="grid h-full w-full place-items-center bg-red-50 text-center text-black">
                  <p className="w-min leading-none">1 person</p>
                </div>
                <div className="grid h-full w-full place-items-center bg-red-200 text-center text-black">
                  <p className="w-min leading-none">11 people</p>
                </div>
                <div className="grid h-full w-full place-items-center bg-red-400 text-center text-white">
                  <p className="w-min leading-none">38 people</p>
                </div>
                <div className="grid h-full w-full place-items-center bg-red-500 text-center text-white">
                  <p className="w-min leading-none">244 people</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <figcaption>
        How one survivor of a scam compound in Myanmar described the structure
        to us. <span className="opacity-70">Source: Author provided</span>
      </figcaption>
    </figure>
  );
}
