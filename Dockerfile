# Node.js 빌드 단계
FROM node:20-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사 (캐시 최적화)
COPY package*.json ./

# 의존성 설치
RUN npm ci

COPY . .

# React 앱 빌드
# (Vite, CRA, Next.js 모두 npm run build로 통일)
RUN npm run build

FROM nginx:alpine

# 빌드된 정적 파일을 Nginx 루트로 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx 설정 복사
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]