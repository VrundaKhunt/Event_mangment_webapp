import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs" 
import Link from "next/link"
import Image from "next/image"
import { Button } from "../ui/button"
import NavItems from "./NavItems"
import MobileNav from "./MobileNav"

const Header = () => {
  return (
    <header className="w-full border-b">
        <div className="wrapper flex items-center justify-between">
            <Link href='/' className="flex w-36">
                <Image src="/assets/images/logoe.svg" width={124} height={38} alt="eventify logo"/>
                <h1 className="flex items-center ml-[-20px] text-xl font-bold ">Eventify</h1>
            </Link>

            <SignedIn>
                <nav className="md:flex-between hidden w-full max-w-xs ">
                    <NavItems/>
                </nav>
            </SignedIn>

            <div className="flex w-32 justify-end gap-3">
                <SignedIn>
                    <UserButton afterSignOutUrl="/"/>
                    <MobileNav/>
                </SignedIn>
                <SignedOut>
                    <Button asChild className="rounded-full bg-[#be185d] hover:bg-[#d72c79]" size="lg">
                        <Link href="/sign-in">
                            Login
                        </Link>
                    </Button>
                </SignedOut>
            </div>

        </div>
    </header>
  )
}

export default Header