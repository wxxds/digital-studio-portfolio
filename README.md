# Launch Spectrum Site

#### This project is running at - https://launchspectrum.afsdigital.studio/

## To run locally

**Option 1:**

`git clone https://github.com/AccentureFederal/launch-spectrum-site.git`

`cd launch-spectrum-site/`

`npm install`

`npm run start`

`open http://localhost:3000/`

**Option 2:**

Navigate to https://afsdigitalstudio.jfrog.io/afsdigitalstudio/webapp/#/login and sign in with Github (Accenture Federal)

Go to your user profile and generate an API key

`docker login afsdigitalstudio-docker.jfrog.io -u USERNAME -p API_KEY`

`docker pull afsdigitalstudio-docker.jfrog.io/launchspectrumsite:latest`

`docker run -p 8080:80 afsdigitalstudio-docker.jfrog.io/launchspectrumsite:latest`

`open http://localhost:8080/`
