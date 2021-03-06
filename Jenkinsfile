pipeline {
    agent {
        docker {
            image 'reimagined/resolve-ci'
            args '-u root:root -v /home/resolve/yarn_cache:/yarn_cache -v /tmp/.X11-unix:/tmp/.X11-unix'
        }
    }
    stages {
        stage('Install') {
            steps {
                script {
                    sh """
                        export YARN_CACHE_FOLDER=/yarn_cache
                        yarn
                    """
                }
            }
        }

        stage('Checks') {
            parallel {
                stage('Prettier') {
                    steps {
                        script {
                            sh """
                                if [ "\$(node_modules/.bin/prettier --no-semi --single-quote --list-different "**/*.js")" ]; then exit 1; fi
                            """
                        }
                    }
                }
                stage('Lint') {
                    steps {
                        script {
                            sh """
                                yarn lint
                            """
                        }
                    }
                }
                stage('Unit tests') {
                    steps {
                        script {
                            sh """
                                yarn test
                            """
                        }
                    }
                }
            }
        }

        stage('Functional tests') {
            when {
                expression { CHANGE_TARGET != 'master' }
            }
            steps {
                script {
                    sh """
                        export DISPLAY=:0;
                        firefox && echo 'err';

                        yarn test:functional
                    """
                }
            }
        }

        stage('Publish canary') {
            when {
                expression { CHANGE_TARGET == 'master' }
            }
            steps {
                script {
                    env.CI_TIMESTAMP = (new Date()).format("MddHHmmss", TimeZone.getTimeZone('UTC'))
                    env.CI_RELEASE_TYPE = 'alpha'

                    sh """
                        export YARN_CACHE_FOLDER=/yarn_cache

                        git log | head -1 | awk '{ print \$2 }' > /last_commit
                        echo \$(cat /last_commit)

                        export CI_CANARY_VERSION=\$(nodejs -e "console.log(JSON.parse(require('fs').readFileSync('./package.json')).version.split('-')[0].split('.').map((ver, idx) => (idx < 2 ? ver : String(+ver + 1) )).join('.'));")-${env.CI_TIMESTAMP}.${env.CI_RELEASE_TYPE}; \
                        echo \$CI_CANARY_VERSION > /canary_version; \

                        yarn oao --version;

                        echo 'registry "http://${env.NPM_ADDR}"' >> /root/.yarnrc; \
                        npm set registry=http://${env.NPM_ADDR}; \
                        cat /root/.yarnrc; \
                        cat /ver.ver; \
                        find . -name package.json -type f -print | grep -v node_modules | xargs -I '%' node -e 'require("fs").writeFileSync(process.argv[1], JSON.stringify((() => { const pj = require(process.argv[1]); if(pj.dependencies) Object.keys(pj.dependencies).forEach(key => { if(key.indexOf("resolve-") < 0) return; pj.dependencies[key] = process.env.CI_CANARY_VERSION  }); return pj; })(), null, 3))' '%'; \
                        yarn run publish --no-checks --no-confirm --new-version \$(cat /canary_version); \
                        sleep 10
                        
                        rm -rf ./*
                        
                        export YARN_CACHE_FOLDER=/yarn_cache

                        yarn global add create-resolve-app@\$(cat /canary_version)
                    """
                }
            }
        }

        stage('Create-resolve-app [ shopping-list-advanced ] Functional Tests') {
            when {
                expression { CHANGE_TARGET == 'master' }
            }
            steps {
                script {
                    sh """
                        mkdir shopping-list-advanced && cd shopping-list-advanced;
                        yarn create resolve-app shopping-list-advanced -e shopping-list-advanced -c \$(cat /last_commit)
                        cd ./shopping-list-advanced
                        yarn
                        cat ./package.json
                        yarn test
                    """
                }
            }
        }

        stage('Create-resolve-app [ hello-world ] Functional Tests') {
            when {
                expression { CHANGE_TARGET == 'master' }
            }
            steps {
                script {
                    sh """
                        mkdir hello-world && cd hello-world;
                        yarn create resolve-app hello-world -c \$(cat /last_commit)
                        cd ./hello-world; 
                        cat ./package.json; 
                        yarn test
                        yarn test:functional path:/chromium
                    """
                }
            }
        }

        stage('Create-resolve-app [ shopping-list ] Functional Tests') {
            when {
                expression { CHANGE_TARGET == 'master' }
            }
            steps {
                script {
                    sh """
                        mkdir shopping-list && cd shopping-list;
                        yarn create resolve-app shopping-list -e shopping-list -c \$(cat /last_commit)
                        cd ./shopping-list
                        cat ./package.json
                        yarn test:functional path:/chromium
                    """
                }
            }
        }

        stage('Create-resolve-app [ hacker-news ] Functional Tests') {
            when {
                expression { CHANGE_TARGET == 'master' }
            }
            steps {
                script {
                    sh """
                        mkdir hacker-news && cd hacker-news;
                        yarn create resolve-app hn -e hacker-news -c \$(cat /last_commit)
                        cd ./hn
                        cat ./package.json
                        yarn test
                        yarn test:functional path:/chromium
                    """
                }
            }
        }

        stage('Create-resolve-app [ with-postcss ] Functional Tests') {
            when {
                expression { CHANGE_TARGET == 'master' }
            }
            steps {
                script {
                    sh """
                        mkdir with-postcss && cd with-postcss;
                        yarn create resolve-app with-postcss -e with-postcss -c \$(cat /last_commit)
                        cd ./with-postcss
                        cat ./package.json
                        yarn test
                        yarn test:functional path:/chromium
                    """
                }
            }
        }

        stage('Create-resolve-app [ with-styled-components ] Functional Tests') {
            when {
                expression { CHANGE_TARGET == 'master' }
            }
            steps {
                script {
                    sh """
                        mkdir with-styled-components && cd with-styled-components;
                        yarn create resolve-app with-styled-components -e with-styled-components -c \$(cat /last_commit)
                        cd ./with-styled-components
                        cat ./package.json
                        yarn test
                        yarn test:functional path:/chromium
                    """
                }
            }
        }
            
        stage('Create-resolve-app [ with-saga ] Functional Tests') {
            when {
                expression { CHANGE_TARGET == 'master' }
            }
            steps {
                script {
                    sh """
                        mkdir with-saga && cd with-saga;
                        yarn create resolve-app with-saga -e with-saga -c \$(cat /last_commit)
                        cd ./with-saga
                        cat ./package.json
                        yarn test
                        yarn test:functional path:/chromium
                    """
                }
            }
        }
    }

    post {
        always {
            script {
                sh 'rm -rf ./*'
            }

            deleteDir()
        }
    }
}
