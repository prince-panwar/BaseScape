import React, { useState, useRef, useEffect } from "react";
import DownArrow from '../../public/Images/png/down_arrow.png'

const CustomSelect = () => {
  const ref = useRef();
  const [isActive, setIsActive] = useState(false);
  const [selected, setIsSelected] = useState("Item 1");
  const [open, setOpen] = useState();

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsActive(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [ref]);

  return (
    <div
      className="custom-select-container"
      onClick={() => setOpen(!open)}
      ref={ref}
    >
      <div className="dropdown">
        <div
          onClick={(e) => {
            setIsActive(!isActive);
          }}
          className="dropdown-btn"
        >
          {selected}
          <span>
            <img src={DownArrow} alt="downarrow" />
          </span>
        </div>
        <div
          className="dropdown-content"
          style={{ display: isActive ? "block" : "none" }}
        >
          <div
            onClick={(e) => {
              setIsSelected(e.target.textContent);
              setIsActive(!isActive);
            }}
            className="item"
          >
            Item 1
          </div>
          <div
            className="item"
            onClick={(e) => {
              setIsSelected(e.target.textContent);
              setIsActive(!isActive);
            }}
          >
            Item 2
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomSelect;
