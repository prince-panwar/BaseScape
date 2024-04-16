import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/Images/svg/BaseScapeLogo.svg";
import Medium from "../../public/Images/svg/Medium (1).svg";
import Discord from "../../public/Images/svg/Discord (1).svg";
import Telegram from "../../public/Images/svg/Telegram (1).svg";
import GitBook from "../../public/Images/svg/Gitbook.svg";
import X from "../../public/Images/svg/X.svg";

const Sidebar = () => {
  const ref = useRef();
  const router = useRouter();
  const [activeItem, setActiveItem] = useState("Deposit");
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState();
  const [menu, setMenu] = useState(false);
  const [selected, setIsSelected] = useState("Choose one");
 
  useEffect(() => {
    const pathname = router.pathname;
    switch (pathname) {
      case "/deposit":
        setActiveItem("Deposit");
        break;
      case "/withdraw":
        setActiveItem("Withdraw");
        break;
      case "/stake":
        setActiveItem("Stake");
        break;
    
      default:
        setActiveItem("Deposit");
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1199);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [router]);

  return (
    <div className="sidebar-wrapper">
      <Image src={Logo} alt="logo" />
      <div className="social-media">
        <span>
          <Link href="https://twitter.com/Ether_Scape" target="_blank" rel="noopener noreferrer">
            <Image src={X} alt="twiiter" />
          </Link>
        </span>
        <span>
          <Link href="https://t.me/Etherscape" target="_blank" rel="noopener noreferrer">
            <Image src={Telegram} alt="telegram" />
          </Link>
        </span>
        <span>
          <Link href="https://discord.gg/ether-scape" target="_blank" rel="noopener noreferrer">
            <Image src={Discord} alt="discord" />
          </Link>
        </span>
        <span>
          <Link href="https://medium.com/@Ether_Scape" target="_blank" rel="noopener noreferrer">
            <Image src={Medium} alt="Medium" />
          </Link>
        </span>
        <span>
          <Link href="https://medium.com/@Ether_Scape" target="_blank" rel="noopener noreferrer">
            <Image src={GitBook} alt="gitBook" />
          </Link>
        </span>
      </div>
      {isMobile ? (
        <div
          className="custom-select-container"
          onClick={() => setOpen(!open)}
          ref={ref}
        >
          <div className="dropdown">
            <div
              onClick={(e) => {
                setMenu(!menu);
              }}
              className="dropdown-btn"
            >
              {activeItem}
            </div>
            <div
              className="dropdown-content"
              style={{ display: menu ? "block" : "none" }}
            >
              <div className={activeItem === "Deposit" ? "active" : ""}>
                <Link href={`/deposit`}>
                  <span onClick={() => setMenu(false)}>Deposit</span>
                </Link>
              </div>
              <div className={activeItem === "Stake" ? "active" : ""}>
                <Link href={`/stake`}>
                  <span onClick={() => setMenu(false)}>Stake</span>
                </Link>
              </div>
              <div className={activeItem === "Withdraw" ? "active" : ""}>
                <Link href={`/withdraw`}>
                  <span onClick={() => setMenu(false)}>Withdraw</span>
                </Link>
              </div>
           </div>
          </div>
        </div>
      ) : (
        <ul>
          <li className={activeItem === "Deposit" ? "active" : ""}>
            <Link href="/deposit"><span>Deposit</span></Link>
          </li>
          <li className={activeItem === "Stake" ? "active" : ""}>
            <Link href="/stake"><span>Stake</span></Link>
          </li>
          <li className={activeItem === "Withdraw" ? "active" : ""}>
            <Link href="/withdraw"><span>Withdraw</span></Link>
          </li>
        
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
