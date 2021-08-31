export function getEnvOptionData(ens = []) {
  return ens.map((item) => ({ label: item.envName, value: item.id }));
}

export function getActiveEnv(ens = []) {
  return ens.filter((item) => item.flag === '1')[0];
}
