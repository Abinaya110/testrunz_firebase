pipeline {
  agent {
    node {
      label 'demo'
    }

  }
  stages {
    stage('pre-build') {
      parallel {
        stage('pre-build') {
          steps {
            echo 'pre-build'
          }
        }

        stage('build') {
          steps {
            echo 'build'
          }
        }

      }
    }

    stage('builds') {
      steps {
        echo 'builds'
      }
    }

    stage('deploy') {
      steps {
        echo 'deploy'
      }
    }

  }
}