import { Link } from "react-router-dom";
import { ImFacebook } from "react-icons/im";
import { TfiTwitterAlt } from "react-icons/tfi";
import { SiInstagram } from "react-icons/si";
import { FaPinterestP } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";

const SocialIcons =()=>{
  return(
   <>
   <div className="socialLinks">
      <ul>
        <li><Link className="facebook"><ImFacebook /></Link></li>
        <li><Link className="twitter"><TfiTwitterAlt /></Link></li>
        <li><Link className="instagram"><SiInstagram /></Link></li>
        <li><Link className="pintrest"><FaPinterestP /></Link></li>
        <li><Link className="linkedin"><FaLinkedinIn /></Link></li>
      </ul>
    </div> 
   </>
  )
}

export default SocialIcons;