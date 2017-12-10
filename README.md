# CircleCI-Rebuild-Serverless

A Serverless AWS Lambda function that runs once per day and rebuilds a set of
CircleCI projects

## Setup

(Assuming you have your AWS access credentials already setup).

1. Run:

```bash
git clone git@github.com:conoro/circleci-rebuild-serverless.git.git
cd circleci-rebuild-serverless.git
npm install -g serverless
npm install
```

2. Rename serverless-sample.env.yml to serverless.env.yml
3. Edit serverless.env.yml and configure your access token, username, scm and
   list of projects to build
4. Then run:

```
serverless deploy
```

Notes:

1. You can also invoke it manually by accessing the GET URL returned by the
   successful serverless deploy
2. You can check manually invoked logs with:

```bash
serverless logs -f check
```

and Cron logs with

```bash
serverless logs -f cron
```

3. If you make minor changes to just the function code, you can do a quick
   re-deploy with:

```bash
serverless deploy function -f check
```

LICENSE Apache-2.0

Copyright Conor O'Neill 2017, conor@conoroneill.com
