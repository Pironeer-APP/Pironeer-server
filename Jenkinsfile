node {
    def app
    environment {
        DB_HOST="${APP_DB_HOST}"
        DB_USER="${APP_DB_USER}"
        DB_PASSWORD="${APP_DB_PASSWORD}"
        DB_PORT="${APP_DB_PORT}"
        DB_NAME="${APP_DB_NAME}"

        OAUTH_USER="${OAUTH_USER}"
        OAUTH_CLIENT_ID="${OAUTH_CLIENT_ID}"
        OAUTH_CLIENT_SECRET="${OAUTH_CLIENT_SECRET}"
        OAUTH_REFRESH_TOKEN="${OAUTH_REFRESH_TOKEN}"

        JWT="${JWT}"
        CURRI_URL="${APP_CURRI_URL}"
    }
    stage('Clone') {
        git branch: 'main',
            url: 'https://github.com/Pironeer-APP/Pironeer-server.git'
    }
    stage('Build Image') {
        sh 'ls'
        app = docker.build('ywonchae1/pironeer-app-server')
    }
    stage('Push Image') {
        docker.withRegistry('https://registry.hub.docker.com', 'ywonchae1') {
            app.push("${env.BUILD_NUMBER}")
            app.push("latest")
        }
    }
    stage('Deploy') {
        sh 'docker run -d -p 3000:3000 --name pironeer-app-server -v /var/jenkins_home/workspace/pirogramming-app-server_main/uploads:/usr/src/app/uploads ywonchae1/≤pironeer-app-server'
    }
}