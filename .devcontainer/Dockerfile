FROM debian:bookworm

ARG NVM_VERSION=0.40.1
ARG NODE_VERSION=22
ARG TASKFILE_VERSION=3.43.2

RUN apt-get update 

RUN apt-get install -y sudo git curl

SHELL ["/bin/bash", "-l", "-c"]

ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=$USER_UID

RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME \
    && mkdir -p /home/$USERNAME \
    && chown $USER_UID:$USER_GID /home/$USERNAME

USER $USERNAME

RUN echo "PS1='\e[0;32m\u@\h\e[m:\e[0;34m\w\e[m\$ '" >> /home/$USERNAME/.bashrc

# NODE
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v${NVM_VERSION}/install.sh | bash
RUN echo 'export NVM_DIR="$HOME/.nvm"' >> $HOME/.bashrc
RUN echo '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm' >> $HOME/.bashrc
RUN echo 'export NVM_DIR="$HOME/.nvm"' >> $HOME/.profile
RUN echo '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm' >> $HOME/.profile
RUN /bin/bash -l -c "nvm install ${NODE_VERSION} && nvm alias default ${NODE_VERSION} && nvm use default"

CMD [ "tail", "-f", "/dev/null" ]
