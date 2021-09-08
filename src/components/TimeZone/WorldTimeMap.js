import React, { Component } from 'react'
import timezones from './timezones.json'
import styles from './styles/styles.module.less'

export default class WorldTimeMap extends Component {
 
  renderNode = (record) => {
    const { value } = this.props
    const style={}
    if(value===record.timezone){
      style.fill='#1890FF'
    }
    return (
      <polygon
        style={style}
        onClick={() => {
          const { onChange } = this.props
          if (onChange) {
            onChange(record)
          }
        }}
        points={record.points}
        onMouseOver={()=>{
          const { onMouseOver } = this.props
          if(onMouseOver){
              onMouseOver(record)
          }
        }}
      />
    )
  }

  renderMap = () => {
    const result = []
    for (let index = 0; index < timezones.length; index++) {
      const element = timezones[index];
      result.push(this.renderNode(element))
    }
    return result
  }

  render() {
    return (
      <div style={{width:'100%'}}>
        <svg className={styles.timezoneMap} viewBox="0 0 500 250">
          {this.renderMap()}
        </svg>
      </div>
    )
  }
}
