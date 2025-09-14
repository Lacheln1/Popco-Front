# 🍿 POPCO

> 당신의 OTT 취향을 찾아주는 콘텐츠 추천 서비스

POPCO는 사용자가 자신만의 OTT 콘텐츠 취향을 발견하고, 개인화된 추천을 통해 새로운 콘텐츠 경험을 제공하는 서비스입니다. 귀여운 메인 캐릭터 **'POPCO'** 와 함께 사용자의 평가 이력, 선호도, 그리고 독자적인 **선호도 진단 시스템**을 활용하여 영화 및 시리즈 콘텐츠를 지능적으로 추천합니다.

---

## 📸 시연 화면

| 로그인 | 선호도 진단 | 메인 |
| :---: | :---: | :---: |
| <img src="https://github.com/user-attachments/assets/eb5a6c37-dbd1-45ef-83b1-5803f6ffd12c" alt="팝코로그인" width="300px" height="auto"> | <img src="https://github.com/user-attachments/assets/f7bcb127-ee9b-44c4-9d30-dcdeede89287" alt="팝코선호도진단" width="300px" height="auto"> | <img src="https://github.com/user-attachments/assets/8861622b-8d2e-4d48-816d-3c4021c1bb44" alt="팝코메인" width="300px" height="auto"> |

| 상세 페이지 | 리스트 | 컬렉션 |
| :---: | :---: | :---: |
| <img src="https://github.com/user-attachments/assets/55f3026f-4a7d-4551-b516-b77d68a6f9d8" alt="팝코상세" width="300px" height="auto"> | <img src="https://github.com/user-attachments/assets/2a8977ba-83d9-4e55-8aa9-ebd015785f56" alt="팝코리스트" width="300px" height="auto"> | <img src="https://github.com/user-attachments/assets/6eecc7c4-d83b-46c8-bdd1-23dc845f8128" alt="팝코컬렉션" width="300px" height="auto"> |

| 취향 분석 | 마이페이지 | 퀴즈 |
| :---: | :---: | :---: |
| <img src="https://github.com/user-attachments/assets/4e185ea4-fa45-4712-ae68-b83fd8f3cfed" alt="팝코취향분석" width="300px" height="auto"> | <img src="https://github.com/user-attachments/assets/af9e6234-ff45-4108-af99-4506829cda71" alt="팝코마이페이지" width="300px" height="auto"> | <img src="https://github.com/user-attachments/assets/69e995e0-7cf5-4431-9bd3-b1ea66d19e9e" alt="팝코퀴즈" width="300px" height="auto"> |

---

## 📌 Table of Contents

* [기술 스택](#기술-스택)
* [✨ 주요 기능](#-주요-기능)
* [🗂 ERD](#-erd)
* [📁 디렉토리 구조](#-디렉토리-구조)
* [👩‍💻 FE 팀원 소개](#-fe-팀원-소개)
* [협업 툴](#협업-툴)

---

## 기술 스택

[![My Skills](https://skillicons.dev/icons?i=ts,react,tailwindcss,html,redux)](https://skillicons.dev)
* **React**: 컴포넌트 기반의 UI를 효율적으로 구축하여 사용자 친화적인 인터페이스를 구현했습니다.
* **TypeScript**: 정적 타입 체크를 통해 코드의 안정성을 높이고 협업 효율을 개선했습니다.
* **Tailwind CSS**: 유틸리티 우선의 CSS 프레임워크로, 빠르고 일관된 스타일링을 적용했습니다.

---

## ✨ 주요 기능

### 👥 회원 시스템
* **소셜 로그인**: 소셜 계정을 통해 간편하게 로그인 및 회원 가입을 진행합니다.

### 🎬 콘텐츠 탐색 및 개인화 시스템
* **콘텐츠 조회 및 필터링**
  * OTT 콘텐츠를 다양한 기준으로 탐색합니다.
  * 기본정보(타입, 장르, 별점), 이용환경(플랫폼, 연도), 개인화(연령대, 사용자 맞춤 추천, 페르소나 캐릭터) 기준으로 정교한 필터링을 제공합니다.
* **AI 기반 콘텐츠 상세**
  * AI가 모든 리뷰를 요약하고, 사용자의 취향에 맞춰 해당 콘텐츠에 대한 AI 멘트를 제공합니다.
* **핫한 컬렉션**
  * 사용자 제작 테마별 콘텐츠 묶음인 '컬렉션'(플레이리스트 개념)을 주간 인기순으로 제공합니다.

#### 개인화된 콘텐츠 추천 엔진
* **콘텐츠 주간 랭킹 & 유사 작품 추천 (콘텐츠 기반 필터링)**
  * 카테고리별(영화/시리즈/전체) 주간 랭킹 TOP 5를 제공합니다.
  * 주간 랭킹 1위 콘텐츠와 유사한 작품을 추천합니다 (줄거리, 제목, 장르, 키워드 기반).
* **개인 맞춤 추천 (협업 필터링)**
  * 사용자 피드백('좋아요', '싫어요', 별점)을 기반으로 협업 필터링을 적용합니다.
* **캐릭터 진단 및 추천 (협업 필터링)**
  * **7가지 캐릭터 유형 진단**: 사용자의 시청 이력 및 초기 5가지 질문을 기반으로 취향을 7가지 캐릭터로 진단하고, '아기 POPCO' / '어른 POPCO'로 취향 선명도를 구분합니다.
    * 🎢 **액션헌터**: 짜릿한 전개, 폭발적인 액션 (액션, 모험, 스릴러, SF, 전쟁)
    * 🧠 **무비 셜록**: 디테일 분석, 반전 추리 (미스터리, 범죄, 다큐멘터리, 역사)
    * 🎭 **시네파 울보**: 감정 이입, 눈물과 감동 (드라마, 로맨스, 음악)
    * 🧸 **온기 수집가**: 따뜻한 위로, 편안한 힐링 (가족, 애니메이션, 코미디)
    * 🌀 **이세계 유랑자**: 상상력 대마왕, 세계관 탐험 (판타지, SF, 애니메이션)
    * 😱 **무서워도본다맨**: 스릴 마니아, 긴장감 중독 (공포, 스릴러)
    * 🏜️ **레트로 캡틴**: 고전의 매력, 아날로그 감성 (서부, 역사, 음악)
  * **초기 진단**: 최초 로그인 시 5가지 질문과 시청 이력 분석을 통해 캐릭터를 진단합니다.
  * **실시간 반영**: '좋아요', '싫어요', 별점(0.5 ~ 5.0) 피드백을 실시간으로 반영하여 페르소나를 동적으로 업데이트합니다.
  * **자신의 캐릭터 기반 추천**: 각 캐릭터에 매핑된 장르 선호도를 기반으로 개인 맞춤 추천을 제공하고, 같은 페르소나를 가진 사용자들의 선호 콘텐츠를 분석해 추천합니다.
  * **AI 취향 멘트**: AI가 사용자의 복합적인 취향을 말풍선 멘트로 생성합니다.
* **AI 챗봇 추천**
  * 자연어 질문("비 오는 날 보기 좋은 영화 뭐야?")에 콘텐츠를 추천합니다.

---

### 🏆 퀴즈 시스템
* **주간 선착순 퀴즈 이벤트**: 매주 1회, 특정 콘텐츠와 연계된 퀴즈를 출제하여 최종 1명의 우승자를 선정합니다.

---

### 📊 나의 기록 페이지
* **달력 연동**: 날짜별 콘텐츠 평가 기록을 제공합니다.
* **개인화된 시청 기록**: 내가 만든/저장한 컬렉션, 남긴 리뷰, 보고 싶은/좋아요 누른 콘텐츠 목록을 한눈에 볼 수 있습니다.
* **시청 통계**: 별점 취향 그래프, 평균 별점, 이벤트 참여 수, 시청 콘텐츠 수, 좋아요/싫어요 비율 등 개인 시청 스타일을 분석합니다.

---

## 🗂 ERD

<img width="1991" height="1186" alt="image" src="https://github.com/user-attachments/assets/123c5c96-2cd7-4778-8696-e15ef7037763" />
* **User**: 사용자의 기본 정보 및 선호도 진단 결과를 저장합니다.
* **Content**: 영화 및 시리즈 콘텐츠의 상세 정보를 관리합니다.
* **Rating**: 사용자의 별점, 좋아요, 싫어요 피드백을 기록하여 추천 시스템에 활용합니다.
* **Collection**: 사용자가 만든 콘텐츠 컬렉션을 저장합니다.

---

## 📁 디렉토리 구조

```
📂Popco
|
|-- Popco-front/ 
|   |
|   |-- node_modules/
|   |-- public/
|   |-- src/
|   |   |
|   |   |-- apis/
|   |   |-- assets/
|   |   |-- components/
|   |   |-- contexts/
|   |   |-- data/
|   |   |-- hooks/
|   |   |-- pages/
|   |   |-- routes/
|   |   |
|   |   |-- index.css
|   |   |-- main.jsx        (리액트 앱 시작점)
|   |
|   |-- .gitignore
|   |-- index.html
|   |-- package.json
|   |-- vite.config.js
```

---

## 👩‍💻 FE 팀원 소개

<table>
  <tbody>
    <tr>
      <td align="center" valign="top">
        <a href="https://github.com/yeeun426">
            <img src="https://avatars.githubusercontent.com/u/88296511?v=4" width="120px;" /><br />
          <b>이예은</b>
        </a>
        <div style="height:45px"></div>
         <hr/>
        <p style="font-size:10px;"># 제작중</p>
      </td>
      <td align="center" valign="top">
        <a href="https://github.com/zeromin41">
          <img src="https://avatars.githubusercontent.com/u/130297212?v=4" width="120px;" /><br />
          <b>심영민</b>
        </a>
        <div style="height:45px"></div>
         <hr/>
        <p>컬렉션 페이지 <br> 선호도 진단 페이지 <br> 상세 페이지 </p>
      </td>
      <td align="center" valign="top">
        <a href="https://github.com/Lacheln1">
          <img src="https://avatars.githubusercontent.com/u/59949555?v=4" width="120px;" /><br />
          <b>홍성현</b>
        </a>
         <hr/>
        <div style="height:45px"></div>
        <p>로그인/회원가입 페이지 <br> 취향 분석 페이지 <br> 마이 페이지 </p>
      </td>
    </tr>
  </tbody>
</table>

---

## 협업 툴
* **JIRA**: 각자 업무 분담 및 진행 상황을 시각적으로 관리
    * <img width="700" alt="image" src="https://github.com/user-attachments/assets/5ee1b729-1cba-4e84-a24d-620dc3af56a3" />
* **Discord**: 실시간 회의 및 소통을 위한 주요 채널로 활용

