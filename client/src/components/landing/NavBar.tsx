import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";

const navbarItem = "w-full md:w-max";

export default function NavBar() {
  return (
    <section>
      <ul className="
        flex flex-col gap-2 justify-center items-start p-4
        md:flex-row md:gap-8 md:items-center
        lg:gap-16
      ">
        <li className={navbarItem}><a href="#why-choose-us"> Why choose us </a></li>
        <li><a href="#solutions"> Solutions </a></li>
        <li><a href="#features"> Features </a></li>
        <li><a href="#hero"> 
          <Image
            src="/Kita.svg"
            alt="Kita Logo"
            width={35}
            height={36}
          />
        </a></li>
        <li><a href="#community"> Community </a></li>
        <li><a href="#request-demo"> Request Demo </a></li>
        
        <Button size={"sm"} asChild>
          <Link href={"/signin"}> Sign In </Link>
        </Button>
      </ul>
    </section>
  );
}