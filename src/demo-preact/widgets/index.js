import { h } from 'preact';

/** @jsx h */

/**
 * 
 * @param {Object} props
 * @param {string} props.tag
 * @param {boolean} props.condition
 * @param {Array} props.children
 * @returns VNode
 */
export function If({ tag = 'div', condition, children = null, ...rest }) {
  if (!condition) return null;

  const Tag = tag;

  return <Tag {...rest}>{children}</Tag>;
}

/**
 * 
 * @param {Object} props
 * @param {string} props.tag
 * @param {Array} props.data
 * @param {Function} props.render
 * @param {Array} props.children
 * @returns VNode
 */
export function Each({ tag = 'ul', data, render, children = null, ...rest }) {
  if (
    !(data instanceof Array)
    || data.length === 0
    || typeof render !== 'function'
  ) {
    return null;
  }

  const Tag = tag;
  let content = data.map(render);

  return <Tag {...rest}>{content}</Tag>;
}