# Scratchy

## Getting Started

```bash
# install dependencies
pnpm install

# boot services
overmind start
```

## [API](./api)

[![CI](https://github.com/jasonraimondi/scratchy/actions/workflows/unit_tests.yml/badge.svg)](https://github.com/jasonraimondi/scratchy/actions/workflows/unit_tests.yml)
[![Docker - API](https://github.com/jasonraimondi/scratchy/actions/workflows/docker_api.yml/badge.svg)](https://github.com/jasonraimondi/scratchy/actions/workflows/docker_api.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/575ba1fd1f6d3b678f06/maintainability)](https://codeclimate.com/github/jasonraimondi/scratchy/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/575ba1fd1f6d3b678f06/test_coverage)](https://codeclimate.com/github/jasonraimondi/scratchy/test_coverage)

* [NestJS](https://www.npmjs.com/package/@nestjs/cli) application with authentication via JWfT
* [bull](https://www.npmjs.com/package/bull) for handling queue / jobs

## [Web](./web)

[![Docker - Web](https://github.com/jasonraimondi/scratchy/actions/workflows/docker_web.yml/badge.svg)](https://github.com/jasonraimondi/scratchy/actions/workflows/docker_web.yml)

## [Cypress E2E Tests](./cypress)

## [K8s](./k8s)

```bash
minikube start
minikube ip
```

Copy the output IP address and add an entry to your hosts for `scratchy.localdomain`

```
127.0.0.1    localhost
{{ ipAddr }} scratchy.localdomain
```

```bash
minikube addons enable ingress
kubectl apply -R -f ./k8s 
```

Mail URL: 