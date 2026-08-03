'use client';

import { useEffect } from 'react';

/**
 * Google Translate modifies DOM text nodes directly.
 * When React then tries to remove those nodes during reconciliation,
 * it throws "NotFoundError: The node to be removed is not a child of this node".
 * This component patches Node.prototype.removeChild to silently skip the
 * operation when the child is not actually attached to that parent.
 * Mount this once in the root layout — it has no visible output.
 */
export default function GoogleTranslateFix() {
  useEffect(() => {
    if (typeof Node === 'undefined') return;

    const origRemove = Node.prototype.removeChild;
    Node.prototype.removeChild = function <T extends Node>(child: T): T {
      if (child.parentNode !== this) return child;
      return origRemove.call(this, child) as T;
    };

    const origInsert = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function <T extends Node>(
      newNode: T,
      refNode: Node | null,
    ): T {
      if (refNode && refNode.parentNode !== this) return newNode;
      return origInsert.call(this, newNode, refNode) as T;
    };
  }, []);

  return null;
}
