#!/bin/sh

docker_registry_host=$1
docker_registry_port=$2
module_name=$3
version=$4

query_command="curl --header \"Accept: application/vnd.docker.distribution.manifest.v2+json\" -X GET http://${docker_registry_host}:${docker_registry_port}/v2/mushiny/${module_name}/manifests/${version}"
echo "${query_command}"
docker_ref_header=`curl --header "Accept: application/vnd.docker.distribution.manifest.v2+json" -X GET http://${docker_registry_host}:${docker_registry_port}/v2/mushiny/${module_name}/manifests/${version}`
echo -e "docker ref header: \n${docker_ref_header}"
docker_ref=`curl --header "Accept: application/vnd.docker.distribution.manifest.v2+json" --head -X GET http://${docker_registry_host}:${docker_registry_port}/v2/mushiny/${module_name}/manifests/${version} |grep Etag |sed -e "s/Etag: //" -e 's/"//g'`
echo -e "docker ref:\n${docker_ref}"

if [ -n "${docker_ref}" ]; then
    echo 'delete old version'
    echo ${docker_ref} > docker_ref_for_delete.txt
    dos2unix docker_ref_for_delete.txt
    docker_new_ref=$(head -1 docker_ref_for_delete.txt)
    echo "curl -X DELETE http://${docker_registry_host}:${docker_registry_port}/v2/mushiny/${module_name}/manifests/${docker_new_ref}"
    curl -X DELETE http://${docker_registry_host}:${docker_registry_port}/v2/mushiny/${module_name}/manifests/${docker_new_ref}
else
    echo "Module ${module_name} no old version."
fi

