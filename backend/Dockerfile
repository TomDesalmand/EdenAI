FROM python:3.11-alpine

RUN apk --no-cache add \
    mariadb-dev \
    build-base \
    && apk add --update --no-cache mariadb-connector-c

WORKDIR /app

COPY requirements.txt ./

RUN apk add --no-cache mariadb-connector-c-dev \
    && pip install --upgrade pip \
    && pip install -r requirements.txt

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
