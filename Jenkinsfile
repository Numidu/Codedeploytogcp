pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')
        DOCKERHUB_USER = 'numidu'
        JAVA_OPTS = "-Dorg.jenkinsci.plugins.durabletask.BourneShellScript.HEARTBEAT_CHECK_INTERVAL=86400"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main',
                    credentialsId: 'github_pat',
                    url: 'https://github.com/Numidu/Codedeploytogcp.git'
            }
        }
    stage('Build Backend Jar') {
        steps {
                dir('userbackend') {
                    sh 'mvn clean package -DskipTests'
            }
        }
    }

        stage('Build Backend Image') {
            steps {
                dir('userbackend') {
                    sh 'docker build -t $DOCKERHUB_USER/spring-backend .'
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                dir('userfrontend') {
                    sh 'docker build -t $DOCKERHUB_USER/react-frontend .'
                }
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                sh """
                    echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_USER --password-stdin
                    docker push $DOCKERHUB_USER/spring-backend
                    docker push $DOCKERHUB_USER/react-frontend
                """
            }
        }

        stage('Deploy on GCP VM') {
            steps {
                sshagent(['gcp_vm_key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ubuntu@<VM_EXTERNAL_IP> '
                            cd ~/app || git clone https://github.com/Numidu/Code-deploy-to-gcp.git ~/app &&
                            cd ~/app &&
                            git pull &&
                            docker-compose down &&
                            docker-compose pull &&
                            docker-compose up -d --build
                        '
                    """
                }
            }
        }
    }
}
