**각 팀원분들 vscode에 아래 스샷 처럼 설정해주셔야 합니다**
![image](https://github.com/user-attachments/assets/d1621b54-e18a-4b5e-ba7b-f3865c782a24)
![image](https://github.com/user-attachments/assets/df81fefa-0907-46c5-ad7c-e295b96a6978)

**font 적용법 (tailwindCSS의 경우)**
```bash
      //Pretendard 다른 weight 
      <h1 className="font-bold ">Pretendard Bold </h1>
      <h2 className="font-semibold ">Pretendard Semi Bold</h2>
      
      //G마켓 폰트
      <h1 className="gmarket-bold">G마켓 Bold 제목</h1>
      <p className="gmarket-light">G마켓 Light 본문</p>
```
**font 적용법(module.css의 경우)**
```css
/* Pretendard 폰트 사용 */
.title {
  font-family: var(--font-pretendard);
  font-weight: 700;  // 이 부분 필요할 경우 500,600,700 중 하나로 수정
}

/* G마켓 폰트 사용 */
.gmarketTitle {
  font-family: var(--font-gmarket);
  font-weight: 700; // 이 부분 필요할 경우 300,500,700 중 하나로 수정
}
```
**styled-Components의 경우**
```css
/* Pretendard 폰트 사용 */
const Title = styled.h1`
  font-family: var(--font-pretendard);
  font-weight: 700; // 이 부분 필요할 경우 500,600,700 중 하나로 수정
`;

/* G마켓 폰트 사용 */
const Title = styled.h1`
  font-family: var(--font-gmarket);
  font-weight: 700; // 이 부분 필요할 경우 300,500,700 중 하나로 수정
`;
```
**Pretendard weight 매핑:**
- Medium: 500 
- SemiBold: 600
- Bold: 700

**gmarket sans weithg 매핑**
- gmarket-light: 300
- gmarket-medium: 500
- gmarket-bold: 700
