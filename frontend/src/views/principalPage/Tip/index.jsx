import "./style.css";

import TipIcon from "../../../assets/TipIcon";
import { motivationalPhrases } from "../../../config/motivationalPhrases";
import { useEffect, useState } from "react";

export default function Tip() {
  const [phraseIndex, setphraseIndex] = useState(0);

  useEffect(() => {
    setInterval(() => {
      setphraseIndex(Math.floor(Math.random() * motivationalPhrases.length));
    }, 10000);
  }, []);

  return (
    <div className="tip_container">
      {motivationalPhrases[phraseIndex].phrase}
      <TipIcon />
    </div>
  );
}
