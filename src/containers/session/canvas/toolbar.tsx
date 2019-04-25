import * as React from 'react'
import { View, Thumbnail } from 'native-base'
import { TouchableWithoutFeedback, StyleSheet, Image } from 'react-native'

import actions, { Action } from '../interface/toolbar/assets/actions';
import tools, { Tools } from './tools';

type CanvasToolProps = {
  tool: string,
  callback: (tool: string, stroke: number) => void,
}

const CanvasTools = (props: CanvasToolProps) => {
  const components = tools.map((tool, i) => {
    var style: any;
    if (tool.id === props.tool) {
      style = {
        transform: [{
          translateY: 0,
        }]
      }
    }
    return (
        <TouchableWithoutFeedback onPress={() => props.callback(tool.id, tool.stroke)} key={i} style={{ ...styles.tool }}>
          <Image source={tool.src} resizeMode='center' style={{ ...styles.toolImage, ...style }} />
        </TouchableWithoutFeedback>
    )
  })
  return (
    <View style={styles.tools}>
      {components}
    </View>
  )
}

type CanvasColorsProps = {
  color: string,
  callback: (color: string) => void,
}

const CanvasColors = (props: CanvasColorsProps) => {
  const baseColors = ["#ff0000", "#008000", "#0000FF", "#000000"];
  const components = baseColors.map((color, i) => {
    var style: any;
    console.log(props.color);
    if (color === props.color) {
      console.log('here:', color);
      style = { 
        borderColor: '#fff' 
      }
    }
    return (
      <TouchableWithoutFeedback onPress={() => props.callback(color)} key={i} style={{ ...styles.color }}>
        <View style={{ ...styles.colorCircle, ...style, backgroundColor: color }} />
      </TouchableWithoutFeedback>
    )
  })
  return (
    <View style={styles.colors}>
      {components}
    </View>
  )
}

type CanvasToolbarProps = {
  tool: string,
  toolCallback: (tool: Tools, stroke: number) => void,
  color: string,
  colorCallback: (color: string) => void,
  handlePress(action: Action): void
}

const CanvasToolbar = (props: CanvasToolbarProps) => (
  <View style={styles.container}>
    <TouchableWithoutFeedback
      onPress={() => props.handlePress(actions.cancel)}
      key={actions.cancel.name}
      style={styles.action}
    >
      <Thumbnail source={actions.cancel.icon} />
    </TouchableWithoutFeedback>
    <CanvasTools tool={props.tool} callback={props.toolCallback} />
    <CanvasColors color={props.color} callback={props.colorCallback} />
    <TouchableWithoutFeedback
      onPress={() => props.handlePress(actions.confirm)}
      key={actions.confirm.name}
      style={styles.action}
    >
      <Thumbnail source={actions.confirm.icon} />
    </TouchableWithoutFeedback>
  </View>
)

export default CanvasToolbar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'transparent',
  },
  tools: {
    flexDirection: "row",
    height: 125,
    marginHorizontal: 25,
  },
  tool: {
    width: 40,
    height: 125,
    marginHorizontal: 10,
  },
  toolImage: {
    width: 40,
    height: 125,
    transform: [{
      translateY: 40,
    }],
  },
  colors: {
    flexDirection: "row",
    marginHorizontal: 25 
  },
  color: {
    width: 40,
    height: 40,
    marginHorizontal: 15,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    borderColor: '#000',
    borderWidth: 3,
    marginHorizontal: 5,
  },
  action: {
    marginHorizontal: 25,
    marginVertical: 10,
  },
})