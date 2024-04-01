import { cn } from "@/lib/utils";
import { Josefin_Sans } from "next/font/google";

const josefin = Josefin_Sans({ subsets: ['latin'] });

export default function Logo({ mini = false }) {
  return (
    <div className={cn(josefin.className, 'h-10', 'flex items-center gap-3 justify-between py-6 px-3')}>{
      mini ? (
        <div className="font-bold rounded-lg h-8 w-8 flex justify-center items-center">
          <span className="text-primary text-md">U</span>
          <span className="text-primary-foreground text-md">++</span>
        </div>
      )
        : (
          <>
            <span className="font-bold text-2xl">
              <span className="text-primary">UNO</span>
              <span>++</span>
            </span>
            <span className="text-muted-foreground text-xs">不止UNO</span>
          </>
          // <div className="bg-primary px-4 h-12 rounded-lg flex items-center">
          //   <span className="text-black text-2xl">UNO</span>
          //   <span className=" text-primary-foreground text-lg">++</span>
          // </div>
        )
    }
    </div>
  );
}