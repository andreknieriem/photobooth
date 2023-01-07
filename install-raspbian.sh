#!/bin/bash

# Stop on the first sign of trouble
set -e

function error {
    echo -e "\033[0;31m${1}\033[0m"
}

error "### Photobooth continued at https://github.com/PhotoboothProject/photobooth"
error "### Please download latest Photobooth installer from  https://github.com/PhotoboothProject/photobooth"
error "###"
error "### More information at https://photoboothproject.github.io/"
