FROM debian:11.3

ARG USER_ID
ARG GROUP_ID

RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - &&\
        apt-get install -y nodejs

RUN    groupadd -g ${GROUP_ID} jenkins &&\
       useradd -l -u ${USER_ID} -g jenkins jenkins &&\
       install -d -m 0755 -o jenkins -g jenkins /home/jenkins
RUN    chown -R jenkins:jenkins /home/jenkins /opt /usr

        
USER jenkins
