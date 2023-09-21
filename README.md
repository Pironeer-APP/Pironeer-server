# SERVER

```
git clone https://github.com/Pironeer-APP/Pironeer-server.git
git pull
npm install

# 브랜치 생성 후 개발 시작
```

**디렉토리 구조**

```
📂
|   .env
|   .gitignore
|   main.js
|   package-lock.json
|   package.json
|   README.md
|   
+---config
|       db.js
|       
+---controllers
|       authController.js
|       
+---models
|       authModel.js
|       
+---node_modules
|
\---routers
        authRouter.js
```

**실행 흐름**
`main.js` --> `routers` --> `controllers` --> `models` --> `controllers` --> `response`