from enum import Enum
from typing import Any, Dict, List, NamedTuple, Optional, Tuple


class NodeName(Enum):
    """Monero Node

    Using a single (private) wallet node.
    """
    OWN = 0

    def __str__(self) -> str:
        if self == NodeName.OWN:
            return 'own node'
        # else
        raise RuntimeError(f'Corrupt value {self} for NodeName -- Should never happen')

    def endpoint(self, own_rpc_endpoint: str) -> str:
        if self == NodeName.OWN:
            return own_rpc_endpoint
        # else
        raise RuntimeError(f'Corrupt value {self} for NodeName -- Should never happen')
