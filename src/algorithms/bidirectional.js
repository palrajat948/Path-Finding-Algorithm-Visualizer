export function bidirectional(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  startNode.isVisited = true;
  finishNode.distance = 0;
  finishNode.isVisitedOther = true;
  var queue1 = [];
  var queue2 = [];
  queue1.push(startNode);
  queue2.push(finishNode);
  while (queue1.length && queue2.length) {
    if (bfs(grid, queue1, false, visitedNodesInOrder) === true)
      return visitedNodesInOrder;
    if (bfs(grid, queue2, true, visitedNodesInOrder) === true)
      return visitedNodesInOrder;
  }
  return visitedNodesInOrder;
}

function bfs(grid, queue, flag, visitedNodesInOrder) {
  if (queue.length > 0) {
    const currnode = queue.shift();
    if (currnode.distance === Infinity) return false;
    visitedNodesInOrder.push(currnode);
    return updateUnvisitedNeighbors(currnode, grid, queue, flag);
  }
}

function updateUnvisitedNeighbors(node, grid, queue, flag) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid, flag);
  for (var neighbor of unvisitedNeighbors) {
    if (neighbor.isWall) continue;
    if (flag && neighbor.isVisited) {
      while (node !== null) {
        var temp = node.previousNode;
        node.previousNode = neighbor;
        neighbor = node;
        node = temp;
      }
      return true;
    } else if (!flag && neighbor.isVisitedOther) {
      while (neighbor !== null) {
        var temp = neighbor.previousNode;
        neighbor.previousNode = node;
        node = neighbor;
        neighbor = temp;
      }
      return true;
    }
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
    if (!flag) {
      neighbor.isVisited = true;
    } else {
      neighbor.isVisitedOther = true;
    }
    queue.push(neighbor);
  }
  return false;
}

function getUnvisitedNeighbors(node, grid, flag) {
  const neighbors = [];
  const {col, row} = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  if (flag === true)
    return neighbors.filter(neighbor => !neighbor.isVisitedOther);
  else return neighbors.filter(neighbor => !neighbor.isVisited);
}
