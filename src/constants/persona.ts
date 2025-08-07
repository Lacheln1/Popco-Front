import babyactionhunter from "../assets/baby-action-hunter.svg";
import actionhunter from "../assets/action-hunter.svg";
import babycrypopco from "../assets/baby-cry-popco.svg";
import crypopco from "../assets/cry-popco.svg";
import babywarmpopco from "../assets/baby-warm-popco.svg";
import warmpopco from "../assets/warm-popco.svg";
import babyhorrorpopco from "../assets/baby-horror-popco.svg";
import horrorpopco from "../assets/horror-popco.svg";
import babyretropopco from "../assets/baby-retro-popco.svg";
import retropopco from "../assets/retro-popco.svg";
import babyimaginepopco from "../assets/baby-imagine-popco.svg";
import imaginepopco from "../assets/imagine-popco.svg";
import babymoviesherlock from "../assets/baby-movie-sherlock.svg";
import moviesherlock from "../assets/movie-sherlock.svg";

export const PERSONA_IMAGES: { [key: string]: string } = {
  "아기 액션헌터": babyactionhunter,
  액션헌터: actionhunter,
  "아기 시네파울보": babycrypopco,
  시네파울보: crypopco,
  "아기 온기수집가": babywarmpopco,
  온기수집가: warmpopco,
  "아기 무서워도본다맨": babyhorrorpopco,
  무서워도본다맨: horrorpopco,
  "아기 레트로캡틴": babyretropopco,
  레트로캡틴: retropopco,
  "아기 이세계유랑자": babyimaginepopco,
  이세계유랑자: imaginepopco,
  "아기 무비셜록": babymoviesherlock,
  무비셜록: moviesherlock,
};

export const PERSONA_NAME_TO_ID: Record<string, number> = {
  액션헌터: 1,
  무비셜록: 2,
  시네파울보: 3,
  온기수집가: 4,
  이세계유랑자: 5,
  무서워도본다맨: 6,
  레트로캡틴: 7,
} as const;
