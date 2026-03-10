FROM php:8.2-apache

RUN apt-get update \
    && apt-get install -y --no-install-recommends git unzip libpng-dev libjpeg-dev libfreetype6-dev libzip-dev libonig-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd mbstring zip \
    && a2enmod rewrite headers \
    && rm -rf /var/lib/apt/lists/*

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www/html
COPY . /var/www/html

RUN composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader \
    && if [ -f cvpricing/composer.json ]; then composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader --working-dir=cvpricing; fi \
    && if [ -f CVSigns/composer.json ]; then composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader --working-dir=CVSigns; fi \
    && if [ -f everonpricing/composer.json ]; then composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader --working-dir=everonpricing; fi
