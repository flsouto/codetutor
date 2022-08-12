FROM sandrokeil/typescript

RUN apt-get -y update
RUN apt-get install -y ffmpeg
