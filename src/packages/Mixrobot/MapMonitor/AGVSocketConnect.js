export function AGVSocketConnect(mqSocket, mapRef) {
  // 潜伏式车状态
  mqSocket.registeLatentAGVStatus((allAgvStatus) => {
    mapRef.updateLatentAGV(allAgvStatus);
  });

  // 潜伏式货架状态
  mqSocket.registeLatentPodStatus((podStatus) => {
    mapRef.refreshLatentPod(podStatus);
  });

  // 料箱车状态
  mqSocket.registeToteAGVStatus((toteAGVStatus) => {
    mapRef.updateToteAGV(toteAGVStatus);
  });

  // 料箱车身上的货架状态
  mqSocket.registeToteStatusCallback((toteStatus) => {
    mapRef.updateToteState(toteStatus);
  });

  // 叉车状态
  mqSocket.registeForkLiftAGVStatus((forkLiftStatus) => {
    mapRef.updateForkLiftAGV(forkLiftStatus);
  });

  // 分拣车状态
  mqSocket.registeSorterAGVStatus((sorterStatus) => {
    mapRef.updateSorterAGV(sorterStatus);
  });

  return mqSocket;
}
